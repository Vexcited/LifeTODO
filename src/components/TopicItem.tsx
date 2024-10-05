import { type Component, createEffect, createSignal, Show } from "solid-js";
import { createStore } from "solid-js/store";
import topics, { type Topic } from "~/stores/topics";

const TopicItem: Component<{
  topic: Topic
}> = (props) => {
  const [editing, setEditing] = createSignal(false);
  const [editingValues, setEditingValues] = createStore(props.topic);

  const toggleEditing = (): Promise<void> | void => {
    if (editing()) return saveEditing();
    else startEditing();
  }

  const saveEditing = async () => {
    await topics.mutate(editingValues);

    setEditingValues(props.topic);
    setEditing(false);
  };

  const startEditing = () => {
    // refresh to store just in case it was changed elsewhere.
    setEditingValues(props.topic);
    setEditing(true);
  }

  return (
    <div class="border border-[#27272a] divide-y divide-[#27272a] rounded-md">
      <div class="flex items-center gap-4 px-6 py-2">
        <Show when={editing()} fallback={
          <h2>
            {props.topic.title || "no title"} 
          </h2>
        }>
          <input
            class="bg-dark-4 px-4 py-.5 w-full rounded-sm border-dark-1 border outline-none"
            value={editingValues.title}
            placeholder={props.topic.title || "no title"}
            onInput={(e) => setEditingValues("title", e.currentTarget.value)}
          />
        </Show>
        
        <p class="text-xs text-white/50 flex-shrink-0">
          since the {props.topic.createdAt.toLocaleDateString()}
        </p>

        <button
          type="button"
          class="ml-auto"
          onClick={() => toggleEditing()}
        >
          {editing() ? "save" : "edit"}
        </button>
      </div>

      <div class="px-6 py-4">
        <Show when={editing()} fallback={
          <p>
            {props.topic.description || "no description"}
          </p>
        }>
          <textarea
            class="bg-dark-4 px-4 py-2 w-full rounded-md border-dark-1 border outline-none"
            value={editingValues.description}
            placeholder={props.topic.description || "no description"}
            onInput={(e) => setEditingValues("description", e.currentTarget.value)}
          />
        </Show>
      </div>
    </div>
  );
};

export default TopicItem;
