/*
  Warnings:

  - The primary key for the `Autor` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id_autor` on the `Autor` table. All the data in the column will be lost.
  - The primary key for the `Libro` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `anio_publicacion` on the `Libro` table. All the data in the column will be lost.
  - You are about to drop the column `codigo_libro` on the `Libro` table. All the data in the column will be lost.
  - You are about to drop the column `editorial` on the `Libro` table. All the data in the column will be lost.
  - You are about to drop the column `id_libro` on the `Libro` table. All the data in the column will be lost.
  - You are about to drop the column `stock` on the `Libro` table. All the data in the column will be lost.
  - The primary key for the `Prestamo` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `estado_prestamo` on the `Prestamo` table. All the data in the column will be lost.
  - You are about to drop the column `fecha_devolucion_esperada` on the `Prestamo` table. All the data in the column will be lost.
  - You are about to drop the column `fecha_devolucion_real` on the `Prestamo` table. All the data in the column will be lost.
  - You are about to drop the column `fecha_prestamo` on the `Prestamo` table. All the data in the column will be lost.
  - You are about to drop the column `id_libro` on the `Prestamo` table. All the data in the column will be lost.
  - You are about to drop the column `id_prestamo` on the `Prestamo` table. All the data in the column will be lost.
  - You are about to drop the column `id_usuario` on the `Prestamo` table. All the data in the column will be lost.
  - The primary key for the `Usuario` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `direccion` on the `Usuario` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Usuario` table. All the data in the column will be lost.
  - You are about to drop the column `fecha_registro` on the `Usuario` table. All the data in the column will be lost.
  - You are about to drop the column `id_usuario` on the `Usuario` table. All the data in the column will be lost.
  - You are about to drop the column `telefono` on the `Usuario` table. All the data in the column will be lost.
  - You are about to drop the `LibroAutor` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[titulo]` on the table `Libro` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[isbn]` on the table `Libro` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `apellido` to the `Autor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `copiasDisponibles` to the `Libro` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fechaPublicacion` to the `Libro` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isbn` to the `Libro` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fechaDevolucionEstimada` to the `Prestamo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `libroId` to the `Prestamo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `usuarioId` to the `Prestamo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `apellido` to the `Usuario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipo` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."LibroAutor" DROP CONSTRAINT "LibroAutor_id_autor_fkey";

-- DropForeignKey
ALTER TABLE "public"."LibroAutor" DROP CONSTRAINT "LibroAutor_id_libro_fkey";

-- DropForeignKey
ALTER TABLE "public"."Prestamo" DROP CONSTRAINT "Prestamo_id_libro_fkey";

-- DropForeignKey
ALTER TABLE "public"."Prestamo" DROP CONSTRAINT "Prestamo_id_usuario_fkey";

-- DropIndex
DROP INDEX "public"."Libro_codigo_libro_key";

-- DropIndex
DROP INDEX "public"."Usuario_email_key";

-- AlterTable
ALTER TABLE "public"."Autor" DROP CONSTRAINT "Autor_pkey",
DROP COLUMN "id_autor",
ADD COLUMN     "apellido" TEXT NOT NULL,
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Autor_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."Libro" DROP CONSTRAINT "Libro_pkey",
DROP COLUMN "anio_publicacion",
DROP COLUMN "codigo_libro",
DROP COLUMN "editorial",
DROP COLUMN "id_libro",
DROP COLUMN "stock",
ADD COLUMN     "copiasDisponibles" INTEGER NOT NULL,
ADD COLUMN     "fechaPublicacion" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "isbn" TEXT NOT NULL,
ADD CONSTRAINT "Libro_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."Prestamo" DROP CONSTRAINT "Prestamo_pkey",
DROP COLUMN "estado_prestamo",
DROP COLUMN "fecha_devolucion_esperada",
DROP COLUMN "fecha_devolucion_real",
DROP COLUMN "fecha_prestamo",
DROP COLUMN "id_libro",
DROP COLUMN "id_prestamo",
DROP COLUMN "id_usuario",
ADD COLUMN     "fechaDevolucionEstimada" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "fechaDevolucionReal" TIMESTAMP(3),
ADD COLUMN     "fechaPrestamo" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "libroId" INTEGER NOT NULL,
ADD COLUMN     "usuarioId" INTEGER NOT NULL,
ADD CONSTRAINT "Prestamo_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "public"."Usuario" DROP CONSTRAINT "Usuario_pkey",
DROP COLUMN "direccion",
DROP COLUMN "email",
DROP COLUMN "fecha_registro",
DROP COLUMN "id_usuario",
DROP COLUMN "telefono",
ADD COLUMN     "apellido" TEXT NOT NULL,
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "tipo" TEXT NOT NULL,
ADD CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "public"."LibroAutor";

-- CreateTable
CREATE TABLE "public"."Libro_Autor" (
    "libroId" INTEGER NOT NULL,
    "autorId" INTEGER NOT NULL,

    CONSTRAINT "Libro_Autor_pkey" PRIMARY KEY ("libroId","autorId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Libro_titulo_key" ON "public"."Libro"("titulo");

-- CreateIndex
CREATE UNIQUE INDEX "Libro_isbn_key" ON "public"."Libro"("isbn");

-- AddForeignKey
ALTER TABLE "public"."Libro_Autor" ADD CONSTRAINT "Libro_Autor_libroId_fkey" FOREIGN KEY ("libroId") REFERENCES "public"."Libro"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Libro_Autor" ADD CONSTRAINT "Libro_Autor_autorId_fkey" FOREIGN KEY ("autorId") REFERENCES "public"."Autor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Prestamo" ADD CONSTRAINT "Prestamo_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "public"."Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Prestamo" ADD CONSTRAINT "Prestamo_libroId_fkey" FOREIGN KEY ("libroId") REFERENCES "public"."Libro"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
