import { Router } from "express";
import {
    crear_libro,
    listar_libros,
    obtener_libro,
    actualizar_libro,
    eliminar_libro,
} from "../controllers/libro.controller.js";

const router = Router();

router.post("/", crear_libro);
router.get("/", listar_libros);
router.get("/:id", obtener_libro);
router.put("/:id", actualizar_libro);
router.delete("/:id", eliminar_libro);

export default router;