import { createRoot, createSignal } from "solid-js";

export type Topic = {
  id: string;
  createdAt: Date;
  order: number
  title: string;
  description: string;
}

export default createRoot(() => {
  const [topics, setTopics] = createSignal<Topic[]>([]);

  const move = async (topic: Topic, to: number) => {
    const newTopics = [...topics()];
    const from = newTopics.indexOf(topic);
    newTopics.splice(from, 1);
    newTopics.splice(to, 0, topic);
    setTopics(newTopics);
  };

  const create = async (): Promise<Topic> => {
    const topic: Topic = {
      id: crypto.randomUUID(),
      createdAt: new Date(),
      order: topics().length, // always make it the last one

      title: "",
      description: ""
    };

    setTopics([...topics(), topic]);
    return topic;
  }

  const mutate = async (topic: Topic): Promise<void> => {
    const newTopics = [...topics()];
    const index = newTopics.findIndex(t => t.id === topic.id);
    newTopics[index] = topic;
    setTopics(newTopics);
  }

  return {
    get items() {
      return topics();
    },

    move,
    mutate,
    create
  }
});
