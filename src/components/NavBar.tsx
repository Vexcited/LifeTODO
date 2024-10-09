import { Show, type Component } from "solid-js";
import { A } from "@solidjs/router";
import auth from "~/stores/auth";

const NavBar: Component = () => {
  return (
    <nav class="flex gap-6 h-14 container px-6 mx-auto items-center">
      <A href="/">
        LifeTODO
      </A>

      <Show when={!auth.token}
        fallback={
          <Show when={auth.user} fallback={
            <p class="ml-auto animate-pulse">loading session...</p>
          }>
            {user => (
              <>
                <p>
                  Welcome, {user().displayName || user().username}!
                </p>

                <A class="ml-auto" href="/account">
                  Account
                </A>

                <Show when={auth.user?.writer}>
                  <A href="/admin">
                    Admin
                  </A>
                </Show>

                <button type="button" onClick={() => auth.logout()}
                  class="bg-[#fafafa] hover:bg-[#fafafa]/90 text-[#18181b] rounded-md text-sm font-medium transition-colors focus-visible:outline-none h-9 px-4 py-2"
                >
                  Sign out
                </button>
              </>
            )}
          </Show>
        }
      >
        <A href="/auth">Authenticate</A>
      </Show>
    </nav>
  )
};

export default NavBar;
