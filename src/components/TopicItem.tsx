import { type JSX, type Component, createSignal, Show } from "solid-js";
import { createStore } from "solid-js/store";
import auth from "~/stores/auth";
import topics, { type LocalTopic } from "~/stores/topics";
import Markdown from "./Markdown";
import { createSortable, transformStyle, useDragDropContext } from "@thisbeyond/solid-dnd";

const TopicItem: Component<{
  topic: LocalTopic
}> = (props) => {
  const sortable = createSortable(props.topic.id);
  const [dragState] = useDragDropContext()!;

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

  const toggleTodoCheckboxHandler: JSX.ChangeEventHandler<HTMLInputElement, Event> = async (event) => {
    event.preventDefault();

    // if not allowed to update, rollback the UI checkbox
    if (!auth.user?.writer) {
      event.currentTarget.checked = props.topic.done;
      return;
    }

    // toggle the property
    const topic = { ...props.topic, done: !props.topic.done };
    await topics.mutate(topic);
  }

  return (
    <div
      ref={sortable.ref}
      style={transformStyle(sortable.transform)}

      classList={{
        "opacity-25": sortable.isActiveDraggable,
        "transition-transform": !!dragState.active.draggable,
      }}
    >
      <div class="border border-[#27272a] divide-y divide-[#27272a] rounded-md">
        <div class="flex items-center gap-4 px-6 py-2">
          <Show when={auth.user?.writer}>
            <div
              {...sortable.dragActivators}
            >
              MOVE
            </div>
          </Show>

          <input
            type="checkbox"
            checked={props.topic.done}
            onChange={toggleTodoCheckboxHandler}
            disabled={!auth.user?.writer}
          />

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

          <p class="text-xs text-white/50 flex-shrink-0" title={`created since ${props.topic.createdAt.toLocaleString()}`}>
            last updated the {props.topic.updatedAt.toLocaleString()}
          </p>

          <Show when={auth.user?.writer}>
            <button
              type="button"
              class="ml-auto"
              onClick={() => toggleEditing()}
            >
              {editing() ? "save" : "edit"}
            </button>
          </Show>
        </div>

        <div class="px-6 py-4">
          <Show when={editing()} fallback={
            <Markdown raw={props.topic.description || "no description"} />
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
    </div>
  );
};

export default TopicItem;
