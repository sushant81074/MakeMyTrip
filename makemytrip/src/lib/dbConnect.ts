import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    console.log("already connected to db");
    return;
  }

  try {
    const db = await mongoose.connect(process.env.DB_URL || "", {});

    connection.isConnected = db.connections[0].readyState;

    console.log("database connection successful");
  } catch (error) {
    console.error("error occured during db connection", error);

    process.exit(1);
  }
}

export default dbConnect;
