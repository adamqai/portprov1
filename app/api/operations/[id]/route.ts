import { db } from '@/lib/db';
import { operations } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

// GET /api/operations/[id] - Get operation by ID
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const result = await db.select().from(operations).where(eq(operations.id, Number(params.id))).limit(1);
    const operation = result[0];
    if (!operation) {
      return NextResponse.json({ error: 'Operation not found' }, { status: 404 });
    }
    return NextResponse.json(operation);
  } catch (error) {
    console.error('Database error (GET /api/operations/[id]):', error);
    return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
  }
}

// PUT /api/operations/[id] - Update operation
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    // TODO: Add validation here
    const updatedOperation = await db.update(operations).set({
      vesselId: body.vesselId,
      berthId: body.berthId,
      operationType: body.operationType,
      startTime: body.startTime,
      endTime: body.endTime,
      status: body.status,
      remarks: body.remarks,
    }).where(eq(operations.id, Number(params.id))).returning();
    if (updatedOperation.length === 0) {
      return NextResponse.json({ error: 'Operation not found' }, { status: 404 });
    }
    return NextResponse.json(updatedOperation[0]);
  } catch (error) {
    console.error('Database error (PUT /api/operations/[id]):', error);
    return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
  }
}

// DELETE /api/operations/[id] - Delete operation
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const deletedOperation = await db.delete(operations).where(eq(operations.id, Number(params.id))).returning();
    if (deletedOperation.length === 0) {
      return NextResponse.json({ error: 'Operation not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Operation deleted successfully' });
  } catch (error) {
    console.error('Database error (DELETE /api/operations/[id]):', error);
    return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
  }
}