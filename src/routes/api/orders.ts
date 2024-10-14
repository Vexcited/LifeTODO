import type { APIEvent } from "@solidjs/start/server";
import { Order } from "~/database/Order";
import { readUser } from "~/server/auth";
import { connectDatabase } from "~/server/database";
import { error, handleError } from "~/server/error";

export async function GET () {
  await connectDatabase();
  const root = await Order.findOne({ isRoot: true });

  // not created yet, let's do it !
  if (!root) {
    await Order.create({ isRoot: true });
    return [];
  }

  return {
    root: root.elements
  };
}

const query = (groupName: string) => groupName === "root"
  ? { isRoot: true }
  : { parent: groupName };

export async function PUT ({ request }: APIEvent) {
  try {
    const user = await readUser(request);

    if (!user.writer) {
      return error("user is not a writer.", 403);
    }

    const body = await request.json() as {
      id: string,
      to: number,
      to_group: string,
      from_group?: string
    }

    const to = await Order.findOne(query(body.to_group));

    if (!to) {
      return error("Root 'to' not found", 404);
    }

    const ids = [...new Set(to.elements.map(e => e.toHexString()))]
    const fromIndex = ids.indexOf(body.id);
        
    if (fromIndex !== -1) {
      // if the element exists, remove it from its original position
      ids.splice(fromIndex, 1);
    }
    
    // insert the element at the new position
    ids.splice(body.to, 0, body.id);

    // update the elements of the group
    await Order.findOneAndUpdate(query(body.to_group), { elements: ids });

    // in case we are moving from a group to another
    // we need to remove the element from the original group.
    if (body.from_group) {
      const from = await Order.findOne(query(body.from_group));

      if (!from) {
        return error("Root 'from' not found", 404);
      }

      const fromIds = [...from.elements] as unknown as string[];
      const fromIndex = fromIds.indexOf(body.id);

      if (fromIndex !== -1) {
        // If the element exists, remove it from its original position
        fromIds.splice(fromIndex, 1);
      }

      await Order.findOneAndUpdate(query(body.from_group), { elements: ids });
    }

    return { success: true };
  }
  catch (e) {
    return handleError(e);
  }
}
