import mongoose, { connect } from "mongoose";

let connected:boolean = false;

const connectDB = async ():Promise<void> => {
  mongoose.set("strictQuery", true);

  if (connected) {
    console.log("MongoDB already connected");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI || '');
    connected = true;
    console.log("MongoDB connected...");
  } catch (error) {
    console.error(error);
  }
};

export default connectDB;
