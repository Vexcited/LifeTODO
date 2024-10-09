import * as mongoose from 'mongoose';

const schema = new mongoose.Schema({
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  order: { type: Number, required: true },
  done: { type: Boolean, default: false },
  title: { type: String, required: false, default: "" },
  description: { type: String, required: false, default: "" },
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic', required: false }
});

export type Topic = mongoose.InferSchemaType<typeof schema>;
export const Topic = mongoose.model('Topic', schema);
