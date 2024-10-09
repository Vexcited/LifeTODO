import { createRoot, createSignal, onMount } from "solid-js";
import auth from "./auth";
import ky from "ky";

export type LocalTopic = {
  id: string;
  done: boolean
  createdAt: Date;
  updatedAt: Date;
  order: number;
  title: string;
  description: string;
  parent?: string;
}

type LocalTopicRaw = Omit<LocalTopic, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string
}

export default createRoot(() => {
  const [topics, setTopics] = createSignal<LocalTopic[]>([]);

  const move = async (from_topic: LocalTopic, to_order: number) => {
    const from_order = from_topic.order;

    const to_topic = topics().find(t => t.order === to_order);
    if (!to_topic) throw new Error("to_topic not found");

    // mutate server state
    await mutate({ ...from_topic, order: to_order });
    await mutate({ ...to_topic, order: from_order });

    // update local state
    await refresh();
  };

  const create = async (parent?: string): Promise<void> => {
    await auth.ky().post("/api/topics", {
      json: { parent }
    });

    await refresh();
  }

  const mutate = async (topic: LocalTopic): Promise<void> => {
    await auth.ky().put("/api/topics", {
      json: topic
    });

    await refresh();
  }

  const refresh = async (): Promise<void> => {
    const response = await ky.get("/api/topics").json<LocalTopicRaw[]>();

    const topics: LocalTopic[] = response.map(t => ({
      ...t,
      createdAt: new Date(t.createdAt),
      updatedAt: new Date(t.updatedAt)
    }));

    setTopics(topics);
  };

  onMount(() => {
    refresh();
  });

  return {
    get items() {
      return topics();
    },

    move,
    mutate,
    create,
    refresh
  }
});
