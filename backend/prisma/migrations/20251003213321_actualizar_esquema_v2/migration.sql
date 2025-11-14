/*
  Warnings:

  - You are about to drop the column `copiasDisponibles` on the `Libro` table. All the data in the column will be lost.
  - You are about to drop the column `tipo` on the `Usuario` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `Usuario` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."Libro" DROP COLUMN "copiasDisponibles";

-- AlterTable
ALTER TABLE "public"."Usuario" DROP COLUMN "tipo",
ADD COLUMN     "email" TEXT NOT NULL DEFAULT 'temporal@ejemplo.com',
ADD COLUMN     "fechaNacimiento" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "public"."Inventario" (
    "id" SERIAL NOT NULL,
    "copiasDisponibles" INTEGER NOT NULL,
    "libroId" INTEGER NOT NULL,

    CONSTRAINT "Inventario_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Inventario_libroId_key" ON "public"."Inventario"("libroId");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "public"."Usuario"("email");

-- AddForeignKey
ALTER TABLE "public"."Inventario" ADD CONSTRAINT "Inventario_libroId_fkey" FOREIGN KEY ("libroId") REFERENCES "public"."Libro"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
