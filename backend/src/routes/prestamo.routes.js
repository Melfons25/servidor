import { Router } from "express";
import {
  crear_prestamo,
  listar_prestamos,
  obtener_prestamo,
  actualizar_prestamo,
  eliminar_prestamo,
} from "../controllers/prestamo.controller.js";

const router = Router();

router.post("/", crear_prestamo);
router.get("/", listar_prestamos);
router.get("/:id", obtener_prestamo);
router.put("/:id", actualizar_prestamo);
router.delete("/:id", eliminar_prestamo);

export default router;
