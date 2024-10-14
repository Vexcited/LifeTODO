import * as mongoose from 'mongoose';

const schema = new mongoose.Schema({
  elements: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Topic', required: false }],
  isRoot: { type: Boolean, default: false },
  parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic', required: false },
});

export type Order = mongoose.InferSchemaType<typeof schema>;
export const Order = mongoose.model('Order', schema);
