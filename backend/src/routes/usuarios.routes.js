import { Router } from "express";
import {
  crear_usuario,
  listar_usuarios,
  obtener_usuario,
  actualizar_usuario,
  eliminar_usuario,
} from "../controllers/usuarios.controller.js";

const router = Router();

router.post("/", crear_usuario);
router.get("/", listar_usuarios);
router.get("/:id", obtener_usuario);
router.put("/:id", actualizar_usuario);
router.delete("/:id", eliminar_usuario);

export default router;

