import { For, Show } from "solid-js";
import topics from "~/stores/topics";
import auth from "~/stores/auth";

import TopicItem from "~/components/TopicItem";
import NavBar from "~/components/NavBar";
import { Title } from "@solidjs/meta";

export default function Home() {
  return (
    <div>
      <Title>LifeTODO</Title>
      <NavBar />

      <main class="container p-6 mx-auto flex flex-col gap-6">
        <div>
          <h1 class="text-3xl font-bold leading-tight">
            Welcome to my life roadmap
          </h1>
          <p class="text-white/65">
            You're currently seeing what's going on at the moment.
          </p>
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
    </div>
  );
}
