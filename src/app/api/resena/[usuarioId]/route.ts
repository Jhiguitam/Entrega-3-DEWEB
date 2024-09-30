import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Obtener reseñas por ID de usuario
export async function GET(request: Request, { params }: { params: { usuarioId: string } }) {
    const { usuarioId } = params;

    // Verificamos si usuarioId es nulo o una cadena vacía
    if (!usuarioId) {
        return NextResponse.json({ error: 'usuarioId es requerido.' }, { status: 400 });
    }

    try {
        const reseñas = await prisma.resena.findMany({
            where: {
                usuarioId: usuarioId,  // Consultamos por usuarioId
            },
        });

        return NextResponse.json(reseñas, { status: 200 });
    } catch (error) {
        console.error('Error al obtener las reseñas:', error);
        return NextResponse.json({ error: 'Error al obtener las reseñas' }, { status: 500 });
    }
}
