import { Router } from "express";
import {
  crear_inventario,
  listar_inventario,
  obtener_inventario,
  actualizar_inventario,
  eliminar_inventario,
} from "../controllers/inventario.controller.js";

const router = Router();

router.post("/", crear_inventario);
router.get("/", listar_inventario);
router.get("/:id", obtener_inventario);
router.put("/:id", actualizar_inventario);
router.delete("/:id", eliminar_inventario);

export default router;