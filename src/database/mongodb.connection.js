import mongoose from "mongoose";

export const databaseConnection = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/employee");
    console.log('Connection to database successful');
  } catch (error) {
    console.log("Error while connecting to database", error);
  }
};
