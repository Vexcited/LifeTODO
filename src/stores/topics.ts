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

  const create = async (parent?: string): Promise<void> => {
    await auth.ky().post("/api/topics", {
      json: { parent }
    });

    await refresh();
  }

  const mutate = async (topic: LocalTopic, doRefresh = true): Promise<void> => {
    await auth.ky().put("/api/topics", {
      json: topic
    });

    if (doRefresh)
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

    mutate,
    create,
    refresh
  }
});
