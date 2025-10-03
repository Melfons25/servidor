

// 1. Importaciones usando ES Modules
import express from "express";
import { PrismaClient } from "@prisma/client";

// 2. Inicializaciones
const app = express();
const prisma = new PrismaClient(); // Inicializamos el cliente Prisma
const PORT = 3000;

// Middleware: Permite que Express lea solicitudes con cuerpo JSON
app.use(express.json());

// ----------------------------------------------------
// RUTAS DE PRUEBA
// ----------------------------------------------------

app.get("/", (req, res) => {
    res.send("Holaa, soy Melaa");
});

app.get("/hello", (req, res) => {
    res.send("This is the hello response");
});


// RUTA CRUD: CREAR USUARIO (POST /usuarios)

app.post('/usuarios', async (req, res) => {
    try {
        // Validación básica de campos requeridos por tu modelo Usuario
        if (!req.body.nombre || !req.body.apellido || !req.body.tipo) {
            return res.status(400).json({ error: 'Faltan campos obligatorios (nombre, apellido, tipo).' });
        }

        // Crea el usuario en la base de datos usando Prisma
        const nuevoUsuario = await prisma.usuario.create({
            data: {
                nombre: req.body.nombre,
                apellido: req.body.apellido,
                tipo: req.body.tipo,
                // Si tu modelo tiene más campos obligatorios, deben ir aquí.
            },
        });
        // Responde con el estado 201 (Creado) y el objeto del nuevo usuario
        res.status(201).json(nuevoUsuario);
    } catch (error) {
        console.error('Error al crear usuario:', error);
        res.status(500).json({ error: 'No se pudo crear el usuario debido a un error del servidor.' });
    }
});


// INICIO DEL SERVIDOR
// Función principal para iniciar la conexión y el servidor
async function startServer() {
    try {
        // 1. Conexión a la BD: Asegura que el cliente Prisma pueda conectar a PostgreSQL
        await prisma.$connect();
        console.log('Conexión a la base de datos (Prisma) exitosa.');

        // 2. Iniciar Express: El servidor empieza a escuchar solicitudes
        app.listen(PORT, () => {
            console.log(` Server de Melaa corriendo en http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error('Error al iniciar el servidor o conectar la base de datos. Asegúrate que Docker esté corriendo:', error.message);
        // Detiene el proceso si no puede conectar a la BD
        process.exit(1);
    }
}

// Iniciar la aplicación
startServer();