import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;

    try {
        // Consulta las estadísticas del héroe con el ID dado
        const estadisticas = await prisma.estadistica.findUnique({
            where: {
                usuarioId: id, // Buscar las estadísticas por el ID del usuario (héroe)
            },
        });

        // Si no se encuentran estadísticas, devuelve un error
        if (!estadisticas) {
            return NextResponse.json({ error: 'Estadísticas no encontradas para el héroe' }, { status: 404 });
        }

        // Devolver las estadísticas en formato JSON
        return NextResponse.json(estadisticas);
    } catch (error) {
        console.error('Error al obtener las estadísticas:', error);
        return NextResponse.json({ error: 'Error al obtener las estadísticas del héroe' }, { status: 500 });
    }
}
