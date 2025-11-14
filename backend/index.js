

// // 1. Importaciones usando ES Modules
// import express from "express";
// import { PrismaClient } from "@prisma/client";

// // 2. Inicializaciones
// const app = express();
// const prisma = new PrismaClient(); // Inicializamos el cliente Prisma
// const PORT = 3000;

// // Middleware: Permite que Express lea solicitudes con cuerpo JSON
// app.use(express.json());

// // ----------------------------------------------------
// // RUTAS DE PRUEBA
// // ----------------------------------------------------

// app.get("/", (req, res) => {
//     res.send("Holaa, soy Melaa");
// });

// app.get("/hello", (req, res) => {
//     res.send("This is the hello response");
// });


// // INICIO DEL SERVIDOR
// // Función principal para iniciar la conexión y el servidor
// async function startServer() {
//     try {
//         // 1. Conexión a la BD: Asegura que el cliente Prisma pueda conectar a PostgreSQL
//         await prisma.$connect();
//         console.log('Conexión a la base de datos (Prisma) exitosa.');

//         // 2. Iniciar Express: El servidor empieza a escuchar solicitudes
//         app.listen(PORT, () => {
//             console.log(` Server de Melaa corriendo en http://localhost:${PORT}`);
//         });

//     } catch (error) {
//         console.error('Error al iniciar el servidor o conectar la base de datos. Asegúrate que Docker esté corriendo:', error.message);
//         // Detiene el proceso si no puede conectar a la BD
//         process.exit(1);
//     }
// }

// // Iniciar la aplicación
// startServer();

import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

// Importar rutas
// index.js (¡Correcto! Navega a 'src' y luego a 'routes')
import usuariosRoutes from "./src/routes/usuarios.routes.js";
import autorRoutes from "./src/routes/autor.routes.js";
import inventarioRoutes from "./src/routes/inventario.routes.js";
import libroRoutes from "./src/routes/libro.routes.js";
import prestamoRoutes from "./src/routes/prestamo.routes.js";

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Ruta principal
app.get("/", (req, res) => {
    res.json({
        message: "API Biblioteca Luz y Saber - Servidor corriendo",
        version: "1.0.0",
    });
});

// Rutas de la API
app.use("/usuarios", usuariosRoutes);
app.use("/autores", autorRoutes);
app.use("/inventario", inventarioRoutes);
app.use("/libros", libroRoutes);
app.use("/prestamos", prestamoRoutes);

// Manejo de ruta no encontrada
app.use((req, res) => {
    res.status(404).json({ error: "Ruta no encontrada" });
});

// Manejo de errores del servidor
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Error en el servidor" });
});

// Iniciar servidor con conexión a Prisma
async function startServer() {
    try {
        await prisma.$connect();
        console.log("Conexión a la base de datos (Prisma) exitosa.");

        app.listen(PORT, () => {
            console.log(`Servidor corriendo en http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error(
            "Error al iniciar el servidor o conectar la base de datos:",
            error.message
        );
        process.exit(1);
    }
}

startServer();
