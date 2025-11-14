import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/**
 * 📚 Crear un nuevo libro (POST /libros)
 * Requiere: titulo, isbn, fechaPublicacion
 */
// Dentro de crear_libro
export const crear_libro = async (req, res) => {
  try {
    // 1. **MÁS IMPORTANTE:** MUESTRA lo que llega para diagnosticar el error
    console.log("Datos recibidos en el controlador:", req.body);

    // 2. Simplifica la captura para incluir SOLO los 3 campos necesarios
    const { titulo, isbn, fechaPublicacion } = req.body;

    // 3. La validación se activa si algún campo es falsy (null, undefined, "")
    if (!titulo || !isbn || !fechaPublicacion) {
      return res.status(400).json({
        error: "Faltan campos obligatorios (titulo, isbn, fechaPublicacion).",
      });
    }

    // 2. Verificación de unicidad para titulo o isbn (replicando el patrón de email de usuario)
    const existe = await prisma.libro.findFirst({
      where: {
        OR: [{ titulo }, { isbn }],
      },
    });

    if (existe) {
      // Mensaje de error más específico
      let campo = existe.titulo === titulo ? 'título' : 'ISBN';
      return res.status(400).json({
        error: `El ${campo} ya está registrado y debe ser único.`
      });
    }

    // 3. Crear el libro
    const nuevoLibro = await prisma.libro.create({
      data: {
        titulo,
        isbn,
        // Aseguramos que la fecha se guarde como tipo DateTime
        fechaPublicacion: new Date(fechaPublicacion),
      },
    });

    res.status(201).json(nuevoLibro);

  } catch (error) {
    console.error("Error al crear libro:", error);

    // Manejo de error de unicidad P2002 (para capturar cualquier caso no detectado antes del create)
    if (error.code === 'P2002') {
      return res.status(400).json({ error: "El título o ISBN ya está registrado y debe ser único." });
    }

    // Error genérico del servidor
    res.status(500).json({ error: "No se pudo crear el libro debido a un error del servidor." });
  }
};

// ... El resto del libro.controller.js (listar_libros, obtener_libro, etc.)
/**
 * 📋 Listar todos los libros (GET /libros)
 */
export const listar_libros = async (req, res) => {
  try {
    // Incluir las relaciones importantes (autores e inventario)
    const libros = await prisma.libro.findMany({
      include: {
        autores: { include: { autor: true } }, // Incluye la tabla pivote y el autor
        inventario: true,
      },
    });
    res.json(libros);
  } catch (error) {
    console.error("Error al listar libros:", error);
    res.status(500).json({ error: "Error al obtener la lista de libros." });
  }
};

/**
 * 🔎 Obtener un libro por ID (GET /libros/:id)
 */
export const obtener_libro = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: "ID inválido." });

    const libro = await prisma.libro.findUnique({
      where: { id },
      include: {
        autores: { include: { autor: true } },
        inventario: true,
        prestamos: true,
      },
    });

    if (!libro) return res.status(404).json({ error: "Libro no encontrado." });

    res.json(libro);
  } catch (error) {
    console.error("Error al obtener libro:", error);
    res.status(500).json({ error: "Error al obtener el libro." });
  }
};

/**
 * ✏️ Actualizar libro (PUT /libros/:id)
 */
export const actualizar_libro = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { titulo, isbn, fechaPublicacion } = req.body;
    if (!id) return res.status(400).json({ error: "ID inválido." });

    // 1. Manejo de la unicidad en la actualización (similar al email del usuario)
    if (titulo || isbn) {
      const existente = await prisma.libro.findFirst({
        where: {
          id: { not: id }, // Excluir el libro actual
          OR: [{ titulo }, { isbn }],
        },
      });
      if (existente) {
        let campo = existente.titulo === titulo ? 'título' : 'ISBN';
        return res.status(400).json({ error: `Ese ${campo} ya está en uso por otro libro.` });
      }
    }

    const libroActualizado = await prisma.libro.update({
      where: { id },
      data: {
        titulo: titulo || undefined,
        isbn: isbn || undefined,
        fechaPublicacion: fechaPublicacion ? new Date(fechaPublicacion) : undefined,
      },
    });

    res.json(libroActualizado);
  } catch (error) {
    console.error("Error al actualizar libro:", error);
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Libro no encontrado." });
    }
    res.status(500).json({ error: "No se pudo actualizar el libro." });
  }
};

/**
 * 🗑️ Eliminar libro (DELETE /libros/:id)
 */
export const eliminar_libro = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: "ID inválido." });

    // **RESTRICCIÓN DE NEGOCIO:** No eliminar si tiene préstamos activos.
    const prestamosActivos = await prisma.prestamo.count({
      where: { libroId: id, fechaDevolucionReal: null },
    });

    if (prestamosActivos > 0) {
      return res.status(400).json({
        error: "No se puede eliminar un libro con préstamos activos.",
      });
    }

    // La eliminación de la relación Libro-Autor debe ser manejada por la DB 
    // (CASCADE DELETE) o debe eliminarse explícitamente aquí:
    await prisma.libro_Autor.deleteMany({ where: { libroId: id } });

    // La relación con Inventario debe ser eliminada primero si es obligatoria:
    await prisma.inventario.deleteMany({ where: { libroId: id } });

    await prisma.libro.delete({ where: { id } });
    res.json({ mensaje: "Libro eliminado correctamente." });

  } catch (error) {
    console.error("Error al eliminar libro:", error);
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Libro no encontrado." });
    }
    if (error.code === "P2003") {
      return res.status(400).json({ error: "El libro tiene dependencias de datos que impiden su eliminación." });
    }
    res.status(500).json({ error: "No se pudo eliminar el libro." });
  }
};