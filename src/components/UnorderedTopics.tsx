import topics from "~/stores/topics";
import orders from "~/stores/orders";
import { type Component, createEffect, createMemo, For, Index, on, onCleanup, onMount } from "solid-js";
import Sortable from 'sortablejs';
import TopicItem from "./TopicItem";

const UnorderedTopics: Component = () => {
  let container: HTMLDivElement | undefined;

  const unordered = createMemo(() => {
    return topics.items.filter(t => {
      // search in every orders
      for (const key of Object.keys(orders.store)) {
        const ids = orders.store[key];

        if (ids.includes(t.id)) {
          return false;
        }
      }

      return true;
    });
  });

  onMount(() => {
    if (!container) return;

    const sortable = new Sortable(container, {
      group: {
        name: "shared",
        put: false 
      },

      sort: false,
      animation: 150,
      dataIdAttr: "data-id",
      handle: ".__topic-handle",
      onEnd: async (event) => {
        const from = unordered()[event.oldIndex!];

        if (event.from !== event.to) {
          await orders.move(from.id, event.newIndex!, event.to.dataset.group!);
        }
      }
    });

    createEffect(on(unordered, (new_order) => {
      queueMicrotask(() => {
        sortable.sort(new_order.map(t => t.id));
      });
    }))

    onCleanup(() => {
      sortable.destroy();
    })
  });

  return (
    <div ref={container}>
      <Index each={unordered()}>
        {(topic, index) => (
          <TopicItem topic={topic()} index={index} />
        )}
      </Index>
    </div>
  )
};

export default UnorderedTopics;
