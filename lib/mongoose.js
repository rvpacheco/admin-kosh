import mongoose from "mongoose";

export async function mongooseConnect() {
    if (mongoose.connection.readyState !== 1) {
        const uri = process.env.MONGODB_URI;
        if (!uri) {
            throw new Error("La variable de entorno MONGODB_URI no está definida.");
        }
        try {
            await mongoose.connect(uri);
            console.log("Conexión a MongoDB establecida");
        } catch (error) {
            console.error("Error al conectar a MongoDB:", error);
            throw error; // Lanzar el error para manejarlo en un nivel superior
        }
    }
    return mongoose.connection;
}
