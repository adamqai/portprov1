import { db } from '@/lib/db';
import { berths } from '@/lib/db/schema';
import { NextResponse } from 'next/server';

// GET /api/berths - List all berths
export async function GET() {
  try {
    const allBerths = await db.select().from(berths);
    return NextResponse.json(allBerths);
  } catch (error) {
    console.error('Database error (GET /api/berths):', error);
    return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
  }
}

// POST /api/berths - Add a new berth
export async function POST(req: Request) {
  try {
    const body = await req.json();
    // TODO: Add validation here
    const newBerth = await db.insert(berths).values({
      name: body.name,
      status: body.status,
      maxDepth: body.maxDepth,
      maxLength: body.maxLength,
    }).returning();
    return NextResponse.json(newBerth[0]);
  } catch (error) {
    console.error('Database error (POST /api/berths):', error);
    return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
  }
}