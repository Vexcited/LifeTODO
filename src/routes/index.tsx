import { createSignal, For, Show } from "solid-js";
import topics, { type LocalTopic } from "~/stores/topics";
import auth from "~/stores/auth";

import NavBar from "~/components/NavBar";
import { Title } from "@solidjs/meta";
import UnorderedTopics from "~/components/UnorderedTopics";
import OrderedTopics from "~/components/OrderedTopics";
import orders from "~/stores/orders";

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
            onClick={async () => {
              topics.create();
              orders.refresh();
            }}
          >
            add new item
          </button>

          <UnorderedTopics />

          <hr />
        </Show>
          
        <OrderedTopics />
      </main>
    </div>
  );
}
