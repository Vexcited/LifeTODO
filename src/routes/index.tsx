import { A } from "@solidjs/router";
import { For, Show } from "solid-js";
import auth from "~/stores/auth";
import topics from "~/stores/topics";
import TopicItem from "~/components/TopicItem";

export default function Home() {
  return (
    <main>
      <nav class="flex justify-between h-14 container px-6 mx-auto items-center">
        <Show when={!auth.token}
          fallback={
            <Show when={auth.user} fallback={
              <p>loading...</p>
            }>
              {user => (
                <>
                  <p>
                    Welcome, {user().displayName}!
                  </p>
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

      <main class="container p-6 mx-auto flex flex-col gap-6">
        <div>
          <h1 class="text-3xl font-bold leading-tight">Some title that'll come from the DB</h1>
          <p>You're currently seeing what's going on at the moment.</p>
        </div>

        <Show when={auth.user?.writer}>
          <button
            type="button"
            class="border-[#fafafa] border border-dashed hover:bg-[#fafafa]/10 text-[#fafafa] rounded-md text-sm font-medium transition-colors focus-visible:outline-none px-4 py-4"
            onClick={() => topics.create()}
          >
            add new item
          </button>
        </Show>

        <div class="flex flex-col gap-6">
          <For each={topics.items}
            fallback={
              <p>Nothing for now !</p>
            }
          >
            {topic => (
              <TopicItem topic={topic} />
            )}
          </For>
        </div>
      </main>
    </main>
  );
}
