import { db } from '@/lib/db';
import { berths } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

// GET /api/berths/[id] - Get berth by ID
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const result = await db.select().from(berths).where(eq(berths.id, Number(params.id))).limit(1);
    const berth = result[0];
    if (!berth) {
      return NextResponse.json({ error: 'Berth not found' }, { status: 404 });
    }
    return NextResponse.json(berth);
  } catch (error) {
    console.error('Database error (GET /api/berths/[id]):', error);
    return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
  }
}

// PUT /api/berths/[id] - Update berth
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    // TODO: Add validation here
    const updatedBerth = await db.update(berths).set({
      name: body.name,
      status: body.status,
      maxDepth: body.maxDepth,
      maxLength: body.maxLength,
    }).where(eq(berths.id, Number(params.id))).returning();
    if (updatedBerth.length === 0) {
      return NextResponse.json({ error: 'Berth not found' }, { status: 404 });
    }
    return NextResponse.json(updatedBerth[0]);
  } catch (error) {
    console.error('Database error (PUT /api/berths/[id]):', error);
    return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
  }
}

// DELETE /api/berths/[id] - Delete berth
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const deletedBerth = await db.delete(berths).where(eq(berths.id, Number(params.id))).returning();
    if (deletedBerth.length === 0) {
      return NextResponse.json({ error: 'Berth not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Berth deleted successfully' });
  } catch (error) {
    console.error('Database error (DELETE /api/berths/[id]):', error);
    return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
  }
}