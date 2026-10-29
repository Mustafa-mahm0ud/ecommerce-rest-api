import mongoose from "mongoose";
import dns from "dns";

if (process.env.DNS_SERVERS) {
  dns.setServers(process.env.DNS_SERVERS.split(","));
}

const connectDB = async () => {
  const conn = await mongoose.connect(process.env.DB_URI);
  console.log(`MongoDB Connected: ${conn.connection.host}`);
};

export default connectDB;
