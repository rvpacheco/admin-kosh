import mongoose from "mongoose";

export async function mongooseConnect() {
    if (mongoose.connection.readyState !== 1) {
        const uri = process.env.MONGODB_URI;
        if (!uri) {
            throw new Error("La variable de entorno MONGODB_URI no está definida.");
        }
        try {
            await mongoose.connect(uri, {
              // Aquí podrías añadir más opciones de configuración
              useNewUrlParser: true,
              useUnifiedTopology: true,
              serverSelectionTimeoutMS: 5000, // Tiempo de espera después del cual se lanzará un Error de conexión
            });
            if (process.env.NODE_ENV !== 'production') {
              console.log("Conexión a MongoDB establecida");
            }
        } catch (error) {
            console.error("Error al conectar a MongoDB:", error);
            // Implementa aquí tu lógica de reintento si es necesario
            throw error; // Lanzar el error para manejarlo en un nivel superior
        }
    }
    return mongoose.connection;
}
