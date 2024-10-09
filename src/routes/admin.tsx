import { Title } from "@solidjs/meta";
import { For, Show } from "solid-js";
import { createEffect, createSignal } from "solid-js";
import NavBar from "~/components/NavBar";
import auth from "~/stores/auth";

/**
 * An administration panel for managing users
 * and monitor what's happening.
 */
export default function Admin() {
  const [users, setUsers] = createSignal<{
    id: string;
    username: string;
    displayName: string;
    writer: boolean;
  }[] | null>(null);

  createEffect(() => {
    auth.ky().get("/api/admin/users")
      .json()
      .then(setUsers)
  })

  return (
    <div>
      <Title>LifeTODO</Title>
      <NavBar />

      <main class="container p-6 mx-auto flex flex-col gap-16">
        <h1 class="text-3xl">Administration Panel</h1>

        <section>
          <div>
            <h2 class="text-4xl">Users</h2>
            <p class="text-lg text-white/65">Manage users and their permissions.</p>
          </div>

          <div class="flex flex-col gap-6 mt-10">
            <Show when={users()} fallback={<p>Loading...</p>}>
              <For each={users()} fallback={<p>No users !</p>}>
                {user => (
                  <div class="flex items-center">
                    <div>
                      <p class="text-lg">{user.displayName}</p>
                      <p class="text-sm text-white/65">{user.username} ({user.id})</p>
                    </div>

                    <div class="ml-auto">
                      <select class="p-2 rounded-md bg-white/10 text-white" onChange={(e) => {
                        const writer = e.currentTarget.value === "admin";
                        console.log(writer);
                        // auth.ky().post(`/api/admin/users/${user.id}`, {
                        //   json: {
                        //     writer: e.currentTarget.value === "admin"
                        //   }
                        // })
                      }}>
                        <option value="user" selected={!user.writer}>User</option>
                        <option value="admin" selected={user.writer}>Admin</option>
                      </select>
                    </div>
                  </div>
                )}
              </For>
            </Show>
          </div>
        </section>
      </main>
    </div>
  )
}
