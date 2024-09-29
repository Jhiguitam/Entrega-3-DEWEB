import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Obtener reseñas por ID de héroe
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const heroeId = searchParams.get('heroeId');

    // Verificamos si heroeId es nulo o una cadena vacía
    if (!heroeId) {
        return NextResponse.json({ error: 'heroeId es requerido.' }, { status: 400 });
    }

    try {
        const reseñas = await prisma.resena.findMany({
            where: {
                usuarioId: heroeId, // Usamos el heroeId para filtrar las reseñas
            },
        });

        return NextResponse.json(reseñas, { status: 200 });
    } catch (error) {
        console.error('Error al obtener las reseñas:', error);
        return NextResponse.json({ error: 'Error al obtener las reseñas' }, { status: 500 });
    }
}

// Crear una nueva reseña
export async function POST(request: Request) {
    const { usuarioId, contenido, calificacion } = await request.json();

    // Validación de contenido y calificación
    if (!contenido || !calificacion) {
        return NextResponse.json({ error: 'Contenido y calificación son requeridos.' }, { status: 400 });
    }

    try {
        const nuevaReseña = await prisma.resena.create({
            data: {
                contenido,
                calificacion,
                fecha: new Date(), // Asignamos la fecha actual
                usuarioId, // ID del usuario que está creando la reseña
            },
        });

        return NextResponse.json(nuevaReseña, { status: 201 });
    } catch (error) {
        console.error('Error al crear la reseña:', error);
        return NextResponse.json({ error: 'Error al crear la reseña' }, { status: 500 });
    }
}
