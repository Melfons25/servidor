import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/**
 * 👤 Crear un nuevo usuario (POST /usuarios)
 */
export const crear_usuario = async (req, res) => {
  try {
    const { nombre, apellido, fechaNacimiento, email } = req.body;

    if (!nombre || !apellido || !fechaNacimiento || !email) {
      return res.status(400).json({
        error:
          "Faltan campos obligatorios (nombre, apellido, fechaNacimiento, email).",
      });
    }

    // Verificar si el email ya existe
    const existe = await prisma.usuario.findUnique({ where: { email } });
    if (existe) {
      return res.status(400).json({ error: "El correo electrónico ya está registrado." });
    }

    // Crear el usuario
    const nuevoUsuario = await prisma.usuario.create({
      data: {
        nombre,
        apellido,
        fechaNacimiento: new Date(fechaNacimiento),
        email,
      },
    });

    res.status(201).json(nuevoUsuario);
  } catch (error) {
    console.error("Error al crear usuario:", error);
    res.status(500).json({
      error: "No se pudo crear el usuario debido a un error del servidor.",
    });
  }
};

/**
 * 📋 Listar todos los usuarios (GET /usuarios)
 */
export const listar_usuarios = async (req, res) => {
  try {
    const usuarios = await prisma.usuario.findMany({ include: { prestamos: true } });
    res.json(usuarios);
  } catch (error) {
    console.error("Error al listar usuarios:", error);
    res.status(500).json({ error: "Error al obtener la lista de usuarios." });
  }
};

/**
 * 🔎 Obtener un usuario por ID (GET /usuarios/:id)
 */
export const obtener_usuario = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: "ID inválido." });

    const usuario = await prisma.usuario.findUnique({
      where: { id },
      include: { prestamos: true },
    });

    if (!usuario) return res.status(404).json({ error: "Usuario no encontrado." });

    res.json(usuario);
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    res.status(500).json({ error: "Error al obtener el usuario." });
  }
};

/**
 * ✏️ Actualizar usuario (PUT /usuarios/:id)
 */
export const actualizar_usuario = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { nombre, apellido, fechaNacimiento, email } = req.body;
    if (!id) return res.status(400).json({ error: "ID inválido." });

    // Si se envía un nuevo email, verificar que no esté duplicado
    if (email) {
      const existente = await prisma.usuario.findUnique({ where: { email } });
      if (existente && existente.id !== id) {
        return res.status(400).json({ error: "Ese correo ya está en uso." });
      }
    }

    const usuarioActualizado = await prisma.usuario.update({
      where: { id },
      data: {
        nombre: nombre || undefined,
        apellido: apellido || undefined,
        fechaNacimiento: fechaNacimiento ? new Date(fechaNacimiento) : undefined,
        email: email || undefined,
      },
    });

    res.json(usuarioActualizado);
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }
    res.status(500).json({ error: "No se pudo actualizar el usuario." });
  }
};

/**
 * 🗑️ Eliminar usuario (DELETE /usuarios/:id)
 */
export const eliminar_usuario = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: "ID inválido." });

    // Verificar si tiene préstamos activos
    const prestamosActivos = await prisma.prestamo.findMany({
      where: { usuarioId: id, fechaDevolucionReal: null },
    });

    if (prestamosActivos.length > 0) {
      return res.status(400).json({
        error: "No se puede eliminar un usuario con préstamos activos.",
      });
    }

    await prisma.usuario.delete({ where: { id } });
    res.json({ mensaje: "Usuario eliminado correctamente." });
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }
    res.status(500).json({ error: "No se pudo eliminar el usuario." });
  }
};