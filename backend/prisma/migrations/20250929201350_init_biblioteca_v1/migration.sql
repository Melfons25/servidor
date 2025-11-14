-- CreateTable
CREATE TABLE "public"."Usuario" (
    "id_usuario" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT,
    "telefono" TEXT,
    "direccion" TEXT,
    "fecha_registro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id_usuario")
);

-- CreateTable
CREATE TABLE "public"."Libro" (
    "id_libro" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "codigo_libro" TEXT NOT NULL,
    "anio_publicacion" INTEGER,
    "editorial" TEXT,
    "stock" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "Libro_pkey" PRIMARY KEY ("id_libro")
);

-- CreateTable
CREATE TABLE "public"."Autor" (
    "id_autor" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Autor_pkey" PRIMARY KEY ("id_autor")
);

-- CreateTable
CREATE TABLE "public"."Prestamo" (
    "id_prestamo" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "id_libro" INTEGER NOT NULL,
    "fecha_prestamo" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_devolucion_esperada" TIMESTAMP(3) NOT NULL,
    "fecha_devolucion_real" TIMESTAMP(3),
    "estado_prestamo" TEXT NOT NULL,

    CONSTRAINT "Prestamo_pkey" PRIMARY KEY ("id_prestamo")
);

-- CreateTable
CREATE TABLE "public"."LibroAutor" (
    "id_libro" INTEGER NOT NULL,
    "id_autor" INTEGER NOT NULL,

    CONSTRAINT "LibroAutor_pkey" PRIMARY KEY ("id_libro","id_autor")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "public"."Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Libro_codigo_libro_key" ON "public"."Libro"("codigo_libro");

-- AddForeignKey
ALTER TABLE "public"."Prestamo" ADD CONSTRAINT "Prestamo_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "public"."Usuario"("id_usuario") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Prestamo" ADD CONSTRAINT "Prestamo_id_libro_fkey" FOREIGN KEY ("id_libro") REFERENCES "public"."Libro"("id_libro") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LibroAutor" ADD CONSTRAINT "LibroAutor_id_libro_fkey" FOREIGN KEY ("id_libro") REFERENCES "public"."Libro"("id_libro") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LibroAutor" ADD CONSTRAINT "LibroAutor_id_autor_fkey" FOREIGN KEY ("id_autor") REFERENCES "public"."Autor"("id_autor") ON DELETE RESTRICT ON UPDATE CASCADE;
