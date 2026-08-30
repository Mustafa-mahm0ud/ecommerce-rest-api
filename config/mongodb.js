import mongoose from "mongoose";
import dns from "dns";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const connectDB = async () => {
  const conn = await mongoose.connect(process.env.DB_URI);
  console.log(`MongoDB Connected: ${conn.connection.host}`);
};

export default connectDB;
