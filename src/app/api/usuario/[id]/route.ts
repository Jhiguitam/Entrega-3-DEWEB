import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request, { params }: { params: { id: string } }) {
    const { id } = params;

    try {
        const usuario = await prisma.usuario.findUnique({
            where: { id },
        });

        if (!usuario) {
            return NextResponse.json({ message: 'Usuario no encontrado' }, { status: 404 });
        }

        return NextResponse.json(usuario);
    } catch (error) {
        return NextResponse.json({ error: 'Error al obtener el usuario' }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
