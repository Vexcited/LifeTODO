import * as mongoose from 'mongoose';

const schema = new mongoose.Schema({
  done: { type: Boolean, default: false },
  title: { type: String, required: true },
  description: { type: String, required: true }
});

export type Topic = mongoose.InferSchemaType<typeof schema>;
export const Topic = mongoose.model('Topic', schema);
