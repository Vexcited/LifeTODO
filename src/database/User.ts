import * as mongoose from 'mongoose';

const schema = new mongoose.Schema({
  writer: { type: Boolean, default: false },
  username: { type: String, required: true },
  password: { type: String, required: true },
  displayName: { type: String, default: null }
});

export type User = mongoose.InferSchemaType<typeof schema>;
export const User = mongoose.model('User', schema);
