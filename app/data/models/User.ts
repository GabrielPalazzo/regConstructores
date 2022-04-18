
import {model, Model, Document, Schema } from 'mongoose';

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  }
});


const User: Model<Document> = model('User', UserSchema);
export default User;
