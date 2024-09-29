import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const usuarioId = params.id;

    try {
        const usuario = await prisma.usuario.findUnique({
            where: {
                id: usuarioId,
            },
            include: {
                estadisticas: true, // Incluir estadísticas en la consulta
            },
        });

        if (!usuario) {
            return NextResponse.json({ message: 'Usuario no encontrado' }, { status: 404 });
        }

        return NextResponse.json(usuario);
    } catch (error) {
        console.error('Error al obtener el usuario:', error);
        return NextResponse.json({ message: 'Error al obtener el usuario' }, { status: 500 });
    }
}
