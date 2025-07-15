import { db } from '@/lib/db';
import { operations } from '@/lib/db/schema';
import { NextResponse } from 'next/server';

// GET /api/operations - List all operations
export async function GET() {
  try {
    const allOperations = await db.select().from(operations);
    return NextResponse.json(allOperations);
  } catch (error) {
    console.error('Database error (GET /api/operations):', error);
    return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
  }
}

// POST /api/operations - Add a new operation
export async function POST(req: Request) {
  try {
    const body = await req.json();
    // TODO: Add validation here
    const newOperation = await db.insert(operations).values({
      vesselId: body.vesselId,
      berthId: body.berthId,
      operationType: body.operationType,
      startTime: body.startTime,
      endTime: body.endTime,
      status: body.status,
      remarks: body.remarks,
    }).returning();
    return NextResponse.json(newOperation[0]);
  } catch (error) {
    console.error('Database error (POST /api/operations):', error);
    return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
  }
}