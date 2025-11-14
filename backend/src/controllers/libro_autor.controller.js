import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/**
 * 🔗 Asociar un Libro con un Autor (POST /libro-autor)
 * Requiere: libroId (Int) y autorId (Int)
 */
export const asociar_libro_autor = async (req, res) => {
    try {
        const { libroId, autorId } = req.body;

        if (!libroId || !autorId) {
            return res.status(400).json({ error: "Se requieren los campos libroId y autorId." });
        }

        // 1. Verificar si la asociación ya existe
        const existe = await prisma.libro_Autor.findUnique({
            where: {
                // Asume que tienes un campo @id o @unique(['libroId', 'autorId']) en tu schema
                libroId_autorId: { libroId, autorId },
            },
        });

        if (existe) {
            return res.status(409).json({ error: "Esta asociación ya existe." });
        }

        // 2. Crear la nueva asociación
        const nuevaAsociacion = await prisma.libro_Autor.create({
            data: { 
                libroId: Number(libroId), 
                autorId: Number(autorId) 
            },
        });

        res.status(201).json(nuevaAsociacion);
    } catch (error) {
        console.error("Error al asociar libro/autor:", error);
        // P2003: Error de clave foránea (Libro o Autor no existe)
        if (error.code === 'P2003') {
             return res.status(404).json({ error: "El Libro o el Autor especificado no existe." });
        }
        res.status(500).json({ error: "No se pudo crear la asociación." });
    }
};

/**
 * 📋 Listar todas las asociaciones Libro-Autor (GET /libro-autor)
 */
export const listar_asociaciones = async (req, res) => {
    try {
        const asociaciones = await prisma.libro_Autor.findMany({
            // Incluir los detalles del Libro y del Autor
            include: {
                libro: true,
                autor: true,
            },
        });
        res.json(asociaciones);
    } catch (error) {
        console.error("Error al listar asociaciones:", error);
        res.status(500).json({ error: "Error al obtener las asociaciones." });
    }
};

/**
 * 🗑️ Eliminar una asociación Libro-Autor (DELETE /libro-autor)
 * Se usan parámetros de consulta o el cuerpo de la petición. Usaremos el cuerpo (BODY).
 */
export const eliminar_asociacion = async (req, res) => {
    try {
        const { libroId, autorId } = req.body;

        if (!libroId || !autorId) {
            return res.status(400).json({ error: "Se requieren los IDs de Libro y Autor para eliminar la asociación." });
        }
        
        // Eliminar la asociación usando el índice compuesto
        await prisma.libro_Autor.delete({
            where: {
                libroId_autorId: { 
                    libroId: Number(libroId), 
                    autorId: Number(autorId) 
                },
            },
        });

        res.json({ mensaje: "Asociación eliminada correctamente." });
    } catch (error) {
        console.error("Error al eliminar asociación:", error);
        // P2025: Asociación no encontrada
        if (error.code === "P2025") {
            return res.status(404).json({ error: "Asociación no encontrada." });
        }
        res.status(500).json({ error: "No se pudo eliminar la asociación." });
    }
};