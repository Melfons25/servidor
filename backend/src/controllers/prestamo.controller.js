import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const crear_prestamo = async (req, res) => {
  try {
    const { usuarioId, libroId, fechaDevolucionEstimada } = req.body;
    if (!usuarioId || !libroId || !fechaDevolucionEstimada) {
      return res.status(400).json({ error: "Faltan campos obligatorios." });
    }

    const prestamo = await prisma.prestamo.create({
      data: {
        usuarioId,
        libroId,
        fechaPrestamo: new Date(),
        fechaDevolucionEstimada: fechaDevolucionEstimada ? new Date(fechaDevolucionEstimada) : null,
      },
    });
    res.status(201).json(prestamo);
  } catch (error) {
    console.error("Error al crear préstamo:", error);
    res.status(500).json({ error: "No se pudo crear el préstamo." });
  }
};

export const listar_prestamos = async (req, res) => {
  try {
    const prestamos = await prisma.prestamo.findMany({
      include: { usuario: true, libro: true },
    });
    res.json(prestamos);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener préstamos." });
  }
};

export const obtener_prestamo = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const prestamo = await prisma.prestamo.findUnique({
      where: { id },
      include: { usuario: true, libro: true },
    });
    if (!prestamo) return res.status(404).json({ error: "Préstamo no encontrado." });
    res.json(prestamo);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener préstamo." });
  }
};

export const actualizar_prestamo = async (req, res) => {
  try {
    const id = Number(req.params.id);

    // Validar ID
    if (!id) {
      return res.status(400).json({ error: "ID de préstamo inválido." });
    }

    // Actualizar la fecha de devolución real a la hora actual (NOW)
    const prestamoActualizado = await prisma.prestamo.update({
      where: { id },
      data: {
        fechaDevolucionReal: new Date(), // Fecha y hora actual del servidor
      },
    });

    res.json({
      mensaje: "Préstamo actualizado correctamente.",
      prestamo: prestamoActualizado,
    });
  } catch (error) {
    console.error("Error al actualizar préstamo:", error);
    res.status(500).json({ error: "No se pudo actualizar préstamo." });
  }
};

export const eliminar_prestamo = async (req, res) => {
  try {
    const id = Number(req.params.id);
    await prisma.prestamo.delete({ where: { id } });
    res.json({ mensaje: "Préstamo eliminado correctamente." });
  } catch (error) {
    res.status(500).json({ error: "No se pudo eliminar préstamo." });
  }
};