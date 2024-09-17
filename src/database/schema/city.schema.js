import { Schema, model } from "mongoose";

const CitySchema = new Schema({
  city: {
    type: String,
    required: true,
    unique: true
  },
  pincode: {
    type: Number,
    required: true,
    unique:true
  }
})

const City = model('city', CitySchema);
export { City, CitySchema }