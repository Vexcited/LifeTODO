import { useNavigate } from "@solidjs/router";
import { Title } from "@solidjs/meta";
import { createEffect } from "solid-js";
import { createStore } from "solid-js/store";
import NavBar from "~/components/NavBar";
import auth from "~/stores/auth";
import { TextField } from "@kobalte/core/text-field";

export default function Account () {
  const navigate = useNavigate();
  const [state, setState] = createStore({
    // update display name
    displayName: auth.user?.displayName || "",

    // update password
    newPassword: "",
    currentPassword: "",
    confirmNewPassword: "",
  });

  type TextProp = "newPassword" | "currentPassword" | "confirmNewPassword" | "displayName";
  const getTextValue = (prop: TextProp) => state[prop];
  const setTextValue = (prop: TextProp) => (value: typeof state[TextProp]) => setState(prop, value);

  createEffect(() => {
    if (!auth.token) {
      navigate('/auth');
    }

    setState(auth.user!);
  });

  const handleNewDisplayName = async (event: SubmitEvent) => {
    event.preventDefault();

    await auth.ky().put("/api/account/display-name", {
      json: {
        displayName: state.displayName,
      }
    });

    // will refetch user metadata from database and update state.
    await auth.checkToken();
  };

  const handlePasswordUpdate = async (event: SubmitEvent) => {
    event.preventDefault();

    if (state.newPassword !== state.confirmNewPassword) {
      alert("passwords do not match, please check again");
      return;
    }

    await auth.ky().post("/api/account/password", {
      json: {
        currentPassword: state.currentPassword,
        newPassword: state.newPassword,
      }
    });

    // will ask user to re-login
    auth.logout(); // will redirect to /auth because of the effect in this component
  }

  return (
    <div>
      <Title>Account - LifeTODO</Title>
      <NavBar />

      <main class="container p-6 mx-auto flex flex-col gap-16">
        <h1 class="text-2xl">
          Actions for your account
        </h1>

        <form class="flex flex-col gap-4 max-w-[400px] w-full"
          onSubmit={handleNewDisplayName}
        >
          <TextField
            class="flex flex-col gap-1 flex-items-start"
            value={getTextValue("displayName")}
            onChange={setTextValue("displayName")}
          >
            <TextField.Label class="text-light/80">
              display name
            </TextField.Label>
            <TextField.Input class="w-full bg-dark-4 px-4 py-2 rounded-md border-dark-1 border outline-none"
              placeholder={auth.user?.displayName || auth.user?.username}
            />
          </TextField>

          <button type="submit"
            class="bg-blue-500 text-white px-4 py-2 rounded w-fit"
          >
            Save
          </button>
        </form>

        <form class="flex flex-col gap-4 max-w-[400px] w-full"
          onSubmit={handlePasswordUpdate}
        >
          <TextField
            class="flex flex-col gap-1 flex-items-start"
            value={getTextValue("currentPassword")}
            onChange={setTextValue("currentPassword")}
          >
            <TextField.Label class="text-light/80">
              current password
            </TextField.Label>
            <TextField.Input type="password" class="w-full bg-dark-4 px-4 py-2 rounded-md border-dark-1 border outline-none" autocomplete="off" />
          </TextField>
          <TextField
            class="flex flex-col gap-1 flex-items-start"
            value={getTextValue("newPassword")}
            onChange={setTextValue("newPassword")}
          >
            <TextField.Label class="text-light/80">
              new password
            </TextField.Label>
            <TextField.Input type="password" class="w-full bg-dark-4 px-4 py-2 rounded-md border-dark-1 border outline-none" autocomplete="off" />
          </TextField>
          <TextField
            class="flex flex-col gap-1 flex-items-start"
            value={getTextValue("confirmNewPassword")}
            onChange={setTextValue("confirmNewPassword")}
          >
            <TextField.Label class="text-light/80">
              confirm new password
            </TextField.Label>
            <TextField.Input type="password" class="w-full bg-dark-4 px-4 py-2 rounded-md border-dark-1 border outline-none" autocomplete="off" />
          </TextField>

          <button type="submit"
            class="bg-blue-500 text-white px-4 py-2 rounded w-fit"
          >
            Save
          </button>
        </form>

        <button type="button"
          class="bg-red-500 text-white px-4 py-2 rounded w-fit"
          onClick={() => {
            alert("TODO: not implemented, you'll just be logout for now")
            auth.logout();
            navigate('/auth');
          }}
        >
          Delete my account
        </button>
      </main>
    </div>
  )
}
