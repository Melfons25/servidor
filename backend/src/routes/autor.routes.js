import { Router } from "express";
import {
  crear_autor,
  listar_autores,
  obtener_autor,
  actualizar_autor,
  eliminar_autor,
} from "../controllers/autor.controller.js";

const router = Router();

router.post("/", crear_autor);
router.get("/", listar_autores);
router.get("/:id", obtener_autor);
router.put("/:id", actualizar_autor);
router.delete("/:id", eliminar_autor);

export default router;