import { Schema, model } from "mongoose";

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role:{
    type:String,
    enum:['admin','employee'],
    default:()=>'employee'
  }
})

const User = model('user', UserSchema);
export { User, UserSchema }