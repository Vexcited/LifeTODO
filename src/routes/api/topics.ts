import type { APIEvent } from "@solidjs/start/server";
import { Topic } from "~/database/Topic";
import { readUser } from "~/server/auth";
import { connectDatabase } from "~/server/database";
import { error, handleError } from "~/server/error";
import type { Document } from "mongoose";
import { Order } from "~/database/Order";

const toJSON = (topic: Document<unknown, {}, Topic> & Topic) => ({
  id: topic.id,
  done: topic.done,
  title: topic.title || "",
  description: topic.description || "",
  parent: topic.parent || null,
  createdAt: topic.createdAt,
  updatedAt: topic.updatedAt
});

export async function GET () {
  await connectDatabase();
  const topics = await Topic.find();

  return topics.map(toJSON);
}

export async function POST ({ request }: APIEvent) {
  try {
    const user = await readUser(request);

    if (!user.writer) {
      return error("user is not a writer.", 403);
    }

    const body = await request.json();

    // always make it the last child by default.
    const topics = await Topic.find(body.parent ? {
      parent: body.parent
    } : {
      parent: null
    });

    const order = topics.length;

    const topic = await Topic.create({
      order,
      title: "",
      description: "",
      parent: body.parent || null,
    });

    return toJSON(topic);
  }
  catch (e) {
    return handleError(e);
  }
}

export async function PUT({ request }: APIEvent) {
  try {
    const user = await readUser(request);

    if (!user.writer) {
      return error("user is not a writer.", 403);
    }

    const body = await request.json();

    const topic: Partial<Topic> = {
      updatedAt: new Date(),
      title: body.title,
      description: body.description,
      parent: body.parent || null,
      done: body.done
    };

    await Topic.findByIdAndUpdate(body.id, topic);

    return { success: true };
  }
  catch (e) {
    return handleError(e);
  }
}

export async function DELETE({ request }: APIEvent) {
  try {
    const user = await readUser(request);

    if (!user.writer) {
      return error("user is not a writer.", 403);
    }

    const body = await request.json() as {
      id: string
    }

    await Topic.findByIdAndDelete(body.id);

    const order = await Order.findOne({
      elements: body.id
    });

    if (order) {
      const updatedElements = order?.elements.filter(e => e.toHexString() !== body.id);
      await Order.findByIdAndUpdate(order?.id, {
        elements: updatedElements
      });
    }

    return { success: true };
  }
  catch (e) {
    return handleError(e);
  }
}