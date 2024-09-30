import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Obtener todas las reseñas
export async function GET(request: Request) {
    try {
        const reseñas = await prisma.resena.findMany();
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
