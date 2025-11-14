import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
/**
 * 👤 Crear un nuevo autor (POST /autores)
 * Requiere: nombre, apellido (obligatorios según el schema)
 */
export const crear_autor = async (req, res) => {
  try {
    // Capturamos SOLO los campos escalares obligatorios: nombre y apellido.
    const { nombre, apellido } = req.body;

    // 1. Validación de campos obligatorios
    if (!nombre || !apellido) {
      return res.status(400).json({
        error: "Faltan campos obligatorios (nombre y apellido)."
      });
    }

    // Crear el autor
    const nuevoAutor = await prisma.autor.create({
      data: { nombre, apellido }
    });

    res.status(201).json(nuevoAutor);

  } catch (error) {
    console.error("Error al crear autor:", error);
    // El resto es un error de servidor
    res.status(500).json({ error: "No se pudo crear el autor debido a un error del servidor." });
  }
};

// -------------------------------------------------------------

/**
 * 📋 Listar todos los autores (GET /autores)
 */
export const listar_autores = async (req, res) => {
  try {
    const autores = await prisma.autor.findMany({
      include: { libros: true } // Incluimos la relación 'libros'
    });
    res.json(autores);
  } catch (error) {
    console.error("Error al listar autores:", error);
    res.status(500).json({ error: "Error al obtener la lista de autores." });
  }
};

// -------------------------------------------------------------

/**
 * 🔎 Obtener un autor por ID (GET /autores/:id)
 */
export const obtener_autor = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: "ID inválido." });

    const autor = await prisma.autor.findUnique({
      where: { id },
      include: { libros: true }
    });

    if (!autor) return res.status(404).json({ error: "Autor no encontrado." });

    res.json(autor);
  } catch (error) {
    console.error("Error al obtener autor:", error);
    res.status(500).json({ error: "Error al obtener el autor." });
  }
};

// -------------------------------------------------------------

/**
 * ✏️ Actualizar autor (PUT /autores/:id)
 */
export const actualizar_autor = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { nombre, apellido } = req.body;
    if (!id) return res.status(400).json({ error: "ID inválido." });

    const autorActualizado = await prisma.autor.update({
      where: { id },
      data: {
        nombre: nombre || undefined,
        apellido: apellido || undefined
      },
    });

    res.json(autorActualizado);
  } catch (error) {
    console.error("Error al actualizar autor:", error);
    // Manejo de error P2025: Autor no encontrado
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Autor no encontrado." });
    }
    // Manejo de error de unicidad P2002
    if (error.code === 'P2002') {
      return res.status(400).json({ error: "El nombre o apellido ya existe." });
    }
    res.status(500).json({ error: "No se pudo actualizar el autor." });
  }
};

// -------------------------------------------------------------

/**
 * 🗑️ Eliminar autor (DELETE /autores/:id)
 */
export const eliminar_autor = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: "ID inválido." });

    // **RESTRICCIÓN DE NEGOCIO:** Verificar si tiene libros asociados (Clave foránea)
    // Usamos deleteMany o una restricción de la DB para eliminar la relación
    await prisma.autor.delete({ where: { id } });

    res.json({ mensaje: "Autor eliminado correctamente." });

  } catch (error) {
    console.error("Error al eliminar autor:", error);
    // Manejo de error P2025: Autor no encontrado
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Autor no encontrado." });
    }
    // Manejo de error P2003: Restricción de clave foránea (aún tiene libros asociados)
    if (error.code === "P2003") {
      return res.status(400).json({ error: "No se puede eliminar porque tiene libros asociados. Elimine las asociaciones primero." });
    }
    res.status(500).json({ error: "No se pudo eliminar el autor." });
  }
};
