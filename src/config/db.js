import { connect } from "mongoose";

const connectDB = async () => {
  try {
    const conexion = await connect(process.env.URL_LOCAL, {});
    console.log(`MongoDB conectado: ${conexion.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
