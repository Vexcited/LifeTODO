import { createEffect, createRoot, createSignal, onMount } from "solid-js";
import { createStore, unwrap } from "solid-js/store";
import auth from "./auth";
import ky from "ky";

export default createRoot(() => {
  const [orders, setOrders] = createStore<Record<string, string[]>>({
    root: []
  });

  /**
   * 
   * @param id 
   * @param to 
   * @param to_group 
   * @param from_group when undefined, from unordered - otherwise could be "root" or id of a topic (subtopic)
   */
  const move = async (id: string, to: number, to_group: string, from_group?: string) => {
    await auth.ky().put("/api/orders", {
      json: {
        id,
        to,
        to_group,
        from_group
      }
    });

    await refresh();
  }

  createEffect(() => console.log(orders.root.length));

  const refresh = async () => {
    const orders = await ky.get("/api/orders").json<Record<string, string[]>>();
    setOrders(orders);
  };

  onMount(() => refresh());

  return {
    move,
    refresh,
    store: orders
  }
});
