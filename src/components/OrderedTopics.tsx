import topics from "~/stores/topics";
import orders from "~/stores/orders";
import { type Component, createEffect, createMemo, createRenderEffect, For, Index, on, onCleanup, onMount } from "solid-js";
import Sortable from 'sortablejs';
import TopicItem from "./TopicItem";

const OrderedTopics: Component = () => {
  const group = "root"; // TODO: move to props one day
  let container: HTMLDivElement | undefined;

  const ordered = createMemo(() => orders.store[group].map(id => {
    return topics.items.find(t => t.id === id)!;
  }).filter(Boolean));

  onMount(() => {
    if (!container) return;

    const sortable = new Sortable(container, {
      group: "shared",
      animation: 150,
      dataIdAttr: "data-id",
      handle: ".__topic-handle",
      onEnd: async (event) => {
        const from = ordered()[event.oldIndex!];
        await orders.move(from.id, event.newIndex!, event.to.dataset.group!, group);
      }
    });

    createEffect(on(ordered, (new_order) => {
      queueMicrotask(() => {
        sortable.sort(new_order.map(t => t.id));
      });
    }))

    onCleanup(() => {
      sortable.destroy();
    })
  });

  return (
    <div data-group={group} ref={container}>
      <Index each={ordered()}>
        {(topic, index) => (
          <TopicItem topic={topic()} index={index} />
        )}
      </Index>
    </div>
  )
};

export default OrderedTopics;
