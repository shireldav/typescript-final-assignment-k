import mongoose from "mongoose";

//connect to mongodb -> address is hidden, in the .env because it is secret
export async function connectDB(): Promise<void> {
  const url = process.env.MONGO_DB;
  if (!url) {
    throw new Error("MONGO_DB value is not found in the .env file");
  }
  await mongoose.connect(url); //waiting until the connection is ready
  console.log("Connected to MongoDB via Atlas");
}
