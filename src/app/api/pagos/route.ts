import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Endpoint para manejar pagos
export async function POST(req: Request) {
    try {
        const { usuarioId, heroeId, amount } = await req.json();

        // Obtener al usuario que va a pagar
        const usuario = await prisma.usuario.findUnique({
            where: { id: usuarioId }
        });

        // Obtener al héroe que recibirá el pago
        const heroe = await prisma.usuario.findUnique({
            where: { id: heroeId }
        });

        if (!usuario || !heroe) {
            return NextResponse.json({ error: 'Usuario o héroe no encontrado.' }, { status: 404 });
        }

        // Verificar que el usuario tenga saldo suficiente
        if (usuario.saldo < amount) {
            return NextResponse.json({ error: 'Saldo insuficiente.' }, { status: 400 });
        }

        // Actualizar los saldos: restar al pagador y añadir al receptor
        await prisma.usuario.update({
            where: { id: usuarioId },
            data: {
                saldo: usuario.saldo - amount
            }
        });

        await prisma.usuario.update({
            where: { id: heroeId },
            data: {
                saldo: heroe.saldo + amount
            }
        });

        return NextResponse.json({ message: 'Pago realizado con éxito.' });
    } catch (error) {
        return NextResponse.json({ error: 'Error al procesar el pago.' }, { status: 500 });
    }
}
