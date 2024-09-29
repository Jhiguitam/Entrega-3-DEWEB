import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // Crear usuarios
    const user1 = await prisma.usuario.create({
        data: {
            id: '1',
            nombre: 'MAMA HUEVOS TROLL',
            rol: 'Heroe',
            email: 'Troll@gmail.com',
            saldo: 15000,
            pass: 'TRoll123',
            descripcion: 'Un héroe muy fuerte.',
            fotoPerfil: 'https://drive.google.com/uc?id=1uKNG7QMmY1Maiz0P0vBRs0vTzNBdJF0z', // Enlace de la imagen 1
        },
    });

    const user2 = await prisma.usuario.create({
        data: {
            id: '2',
            nombre: 'EL GRAN TROLL',
            rol: 'Heroe',
            email: 'GranTroll@gmail.com',
            saldo: 20000,
            pass: 'GranTroll123',
            descripcion: 'El gran troll que salva a los gatos.',
            fotoPerfil: 'https://drive.google.com/uc?id=1OZuFzQ17CpdAJT_ud5dM8B3xQqCf7K1Z', // Enlace de la imagen 2
        },
    });

    console.log({ user1, user2 });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

