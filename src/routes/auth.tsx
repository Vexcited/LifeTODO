import { Match, Show, Switch } from "solid-js";
import { createStore } from "solid-js/store";
import { A, useNavigate } from "@solidjs/router";
import ky, { HTTPError } from "ky";
import auth from "~/stores/auth";

import { TextField } from "@kobalte/core/text-field";

import type { CheckAuthResponse } from "./api/check-auth";
import type { SignupResponse } from "./api/signup";

enum AuthStep {
  Initial,
  Login,
  Signup
}

export default function Auth () {
  const navigate = useNavigate();

  const [state, setState] = createStore({
    step: AuthStep.Initial,
    
    username: "",
    signedUsername: "",

    password: "",
    displayName: "",

    canSignup: true,
    willBeWriter: false,

    error: null as string | null,
  });

  type TextProp = "username" | "password" | "displayName";
  const getTextValue = (prop: TextProp) => state[prop];
  const setTextValue = (prop: TextProp) => (value: typeof state[TextProp]) => setState(prop, value);

  const handleInitialStep = async (e: SubmitEvent) => {
    e.preventDefault();
    setState("error", null);

    try {
      const response = await ky.post("/api/check-auth", {
        json: {
          username: state.username
        }
      }).json<CheckAuthResponse>();

      if (response.exists) {
        setState({
          step: AuthStep.Login,
          signedUsername: response.signedUsername
        });
      }
      else {
        setState({
          step: AuthStep.Signup,
          canSignup: response.canSignup,
          willBeWriter: response.willBeWriter,
          signedUsername: response.signedUsername
        })
      }
    } catch (e) {
      if (e instanceof HTTPError) {
        const error = await e.response.text();
        setState("error", error);
      }
    }
  };

  const handleSignupStep = async (e: SubmitEvent) => {
    e.preventDefault();
    setState("error", null);

    try {
      const response = await ky.post("/api/signup", {
        json: {
          password: state.password,
          displayName: state.displayName
        },
        headers: {
          Authorization: `Bearer ${state.signedUsername}`
        }
      }).json<SignupResponse>();

      auth.preserveToken(response.token);
      navigate("/");
    } catch (e) {
      if (e instanceof HTTPError) {
        const error = await e.response.text();
        setState("error", error);
      }
    }
  }

  const handleLoginStep = async (e: SubmitEvent) => {
    e.preventDefault();
    setState("error", null);

    try {
      const response = await ky.post("/api/login", {
        json: {
          password: state.password
        },
        headers: {
          Authorization: `Bearer ${state.signedUsername}`
        }
      }).json<SignupResponse>();

      auth.preserveToken(response.token);
      navigate("/");
    } catch (e) {
      if (e instanceof HTTPError) {
        const error = await e.response.text();
        setState("error", error);
      }
    }
  }

  return (
    <div class="flex flex-col items-center justify-center h-screen px-6">
      <main class="max-w-[420px] w-full text-center flex flex-col gap-6">
        <h1 class="text-2xl font-700">
          authenticate
        </h1>

        <Show when={state.error}>
          <p>
            {state.error}
          </p>
        </Show>

        <Switch>
          <Match when={state.step === AuthStep.Initial}>
            <form
              class="flex flex-col gap-4"
              onSubmit={handleInitialStep}
            >
              <TextField
                class="flex flex-col gap-1 flex-items-start"
                value={getTextValue("username")}
                onChange={setTextValue("username")}
              >
                <TextField.Label class="text-light/80">
                  username
                </TextField.Label>
                <TextField.Input class="w-full bg-dark-4 px-4 py-2 rounded-md border-dark-1 border outline-none" autocomplete="off" />
              </TextField>

              <button
                type="submit"
                class="bg-dark-6 text-white px-4 py-2 rounded-md hover:bg-dark-7 transition-colors"
              >
                check !
              </button>
            </form>
          </Match>
          <Match when={state.step === AuthStep.Signup}>
            <form
              class="flex flex-col gap-4"
              onSubmit={handleSignupStep}
            >
              <TextField
                class="flex flex-col gap-1 flex-items-start"
                value={getTextValue("password")}
                onChange={setTextValue("password")}
              >
                <TextField.Label class="text-light/80">
                  password
                </TextField.Label>
                <TextField.Input type="password" class="w-full bg-dark-4 px-4 py-2 rounded-md border-dark-1 border outline-none" autocomplete="off" />
              </TextField>

              <TextField
                class="flex flex-col gap-1 flex-items-start"
                value={getTextValue("displayName")}
                onChange={setTextValue("displayName")}
              >
                <TextField.Label class="text-light/80">
                display name
                </TextField.Label>
                <TextField.Input class="w-full bg-dark-4 px-4 py-2 rounded-md border-dark-1 border outline-none" autocomplete="off" />
                <TextField.Description class="text-light/60 text-xs pt-1 text-left">
                  a cool name to display in the UI instead of your username.
                </TextField.Description>
              </TextField>

              <button
                type="submit"
                disabled={!state.canSignup}
                class="bg-dark-6 text-white px-4 py-2 rounded-md hover:bg-dark-7 transition-colors"
              >
                sign me up !
              </button>
              <Show when={state.willBeWriter}>
                <p>you'll be the first user to sign up, that'll make you an admin directly.</p>
              </Show>
              <Show when={!state.canSignup}>
                <p>this instance does not accept new signups.</p>
              </Show>
            </form>
          </Match>
          <Match when={state.step === AuthStep.Login}>
            <form
              class="flex flex-col gap-4"
              onSubmit={handleLoginStep}
            >
              <TextField
                class="flex flex-col gap-1 flex-items-start"
                value={getTextValue("password")}
                onChange={setTextValue("password")}
              >
                <TextField.Label class="text-light/80">
                  password
                </TextField.Label>
                <TextField.Input type="password" class="w-full bg-dark-4 px-4 py-2 rounded-md border-dark-1 border outline-none" autocomplete="off" />
              </TextField>

              <button
                type="submit"
                disabled={!state.canSignup}
                class="bg-dark-6 text-white px-4 py-2 rounded-md hover:bg-dark-7 transition-colors"
              >
                let's go !
              </button>
            </form>
          </Match>
        </Switch>

        <A href="/" class="opacity-50 hover:opacity-30 transition-opacity py-2 w-fit mx-auto">
          nah, let's go back
        </A>
      </main>
    </div>
  )
}