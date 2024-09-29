-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "rol" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "saldo" INTEGER NOT NULL,
    "pass" TEXT NOT NULL,
    "descripcion" TEXT,
    "fotoPerfil" BYTEA,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Resena" (
    "id" TEXT NOT NULL,
    "contenido" TEXT NOT NULL,
    "calificacion" INTEGER NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "usuarioId" TEXT NOT NULL,

    CONSTRAINT "Resena_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Estadistica" (
    "id" TEXT NOT NULL,
    "estrellas" DOUBLE PRECISION NOT NULL,
    "solicitudes" INTEGER NOT NULL,
    "calidadServicio" DOUBLE PRECISION NOT NULL,
    "puntualidad" DOUBLE PRECISION NOT NULL,
    "usuarioId" TEXT NOT NULL,

    CONSTRAINT "Estadistica_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Estadistica_usuarioId_key" ON "Estadistica"("usuarioId");

-- AddForeignKey
ALTER TABLE "Resena" ADD CONSTRAINT "Resena_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Estadistica" ADD CONSTRAINT "Estadistica_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
