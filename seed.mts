import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // Crear o actualizar Usuario 1
    const user1 = await prisma.usuario.upsert({
        where: { id: '1' }, // Verifica si ya existe el usuario con ID 1
        update: {},         // Si existe, no actualiza nada (puedes actualizar si lo necesitas)
        create: {           // Si no existe, lo crea con estos datos
            id: '1',
            nombre: 'MAMA HUEVOS TROLL',
            rol: 'Heroe',
            email: 'Troll@gmail.com',
            saldo: 15000,
            pass: 'TRoll123',
            descripcion: 'Un héroe muy fuerte.',
            fotoPerfil: 'https://drive.google.com/uc?id=1uKNG7QMmY1Maiz0P0vBRs0vTzNBdJF0z',
        },
    });

    // Crear o actualizar Usuario 2
    const user2 = await prisma.usuario.upsert({
        where: { id: '2' },
        update: {},
        create: {
            id: '2',
            nombre: 'EL GRAN TROLL',
            rol: 'Heroe',
            email: 'GranTroll@gmail.com',
            saldo: 20000,
            pass: 'GranTroll123',
            descripcion: 'El gran troll que salva a los gatos.',
            fotoPerfil: 'https://drive.google.com/uc?id=1OZuFzQ17CpdAJT_ud5dM8B3xQqCf7K1Z',
        },
    });

    // Crear o actualizar Estadísticas del Usuario 1
    const stats1 = await prisma.estadistica.upsert({
        where: { id: '1' }, // Asegura que las estadísticas del usuario 1 se manejan correctamente
        update: {},         // Si ya existe, no actualizamos nada
        create: {
            id: '1',
            usuarioId: '1',
            estrellas: 4.5,
            solicitudes: 50,
            calidadServicio: 4.8,
            puntualidad: 4.9,
        },
    });

    // Crear o actualizar Estadísticas del Usuario 2
    const stats2 = await prisma.estadistica.upsert({
        where: { id: '2' },
        update: {},
        create: {
            id: '2',
            usuarioId: '2',
            estrellas: 4.0,
            solicitudes: 40,
            calidadServicio: 4.7,
            puntualidad: 4.6,
        },
    });

    console.log({ user1, user2, stats1, stats2 });
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
