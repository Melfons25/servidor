import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// Crear inventario (1:1 con Libro)
export const crear_inventario = async (req, res) => {
  try {
    const { libroId, copiasDisponibles } = req.body;

    // Validar campos
    if (!libroId || copiasDisponibles == null) {
      return res.status(400).json({ error: "Faltan campos obligatorios (libroId, copiasDisponibles)." });
    }

    // Validar que el libro exista
    const libro = await prisma.libro.findUnique({ where: { id: Number(libroId) } });
    if (!libro) {
      return res.status(404).json({ error: "El libro especificado no existe." });
    }

    // Verificar que ese libro no tenga ya inventario
    const inventarioExistente = await prisma.inventario.findUnique({ where: { libroId: Number(libroId) } });
    if (inventarioExistente) {
      return res.status(400).json({ error: "Ya existe un inventario para este libro (relación 1:1)." });
    }

    // Crear inventario
    const nuevoInventario = await prisma.inventario.create({
      data: {
        libroId: Number(libroId),
        copiasDisponibles: Number(copiasDisponibles),
      },
      include: { libro: true },
    });

    res.status(201).json(nuevoInventario);
  } catch (error) {
    console.error("Error al crear inventario:", error);
    res.status(500).json({ error: "No se pudo crear el inventario." });
  }
};

// Listar todo el inventario
export const listar_inventario = async (req, res) => {
  try {
    const inventario = await prisma.inventario.findMany({
      include: { libro: true },
    });
    res.json(inventario);
  } catch (error) {
    console.error("Error al obtener inventario:", error);
    res.status(500).json({ error: "Error al obtener inventario." });
  }
};

// Obtener inventario por ID
export const obtener_inventario = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const item = await prisma.inventario.findUnique({
      where: { id },
      include: { libro: true },
    });
    if (!item) return res.status(404).json({ error: "Inventario no encontrado." });
    res.json(item);
  } catch (error) {
    console.error("Error al obtener inventario:", error);
    res.status(500).json({ error: "Error al obtener inventario." });
  }
};

// Actualizar inventario
export const actualizar_inventario = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { copiasDisponibles } = req.body;

    if (copiasDisponibles == null) {
      return res.status(400).json({ error: "Debe especificar copiasDisponibles." });
    }

    const itemActualizado = await prisma.inventario.update({
      where: { id },
      data: { copiasDisponibles: Number(copiasDisponibles) },
      include: { libro: true },
    });

    res.json(itemActualizado);
  } catch (error) {
    console.error("Error al actualizar inventario:", error);
    res.status(500).json({ error: "No se pudo actualizar inventario." });
  }
};

// Eliminar inventario
export const eliminar_inventario = async (req, res) => {
  try {
    const id = Number(req.params.id);
    await prisma.inventario.delete({ where: { id } });
    res.json({ mensaje: "Inventario eliminado correctamente." });
  } catch (error) {
    console.error("Error al eliminar inventario:", error);
    res.status(500).json({ error: "No se pudo eliminar inventario." });
  }
};
