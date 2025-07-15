import { db } from '@/lib/db';
import { vessels } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

// GET /api/vessels/[id] - Get vessel by ID
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const result = await db.select().from(vessels).where(eq(vessels.id, Number(params.id))).limit(1);
    const vessel = result[0];
    if (!vessel) {
      return NextResponse.json({ error: 'Vessel not found' }, { status: 404 });
    }
    return NextResponse.json(vessel);
  } catch (error) {
    console.error('Database error (GET /api/vessels/[id]):', error);
    return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
  }
}

// PUT /api/vessels/[id] - Update vessel
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    // TODO: Add validation here
    const updatedVessel = await db.update(vessels).set({
      vesselName: body.vessel_name,
      vesselType: body.vessel_type,
      imoNumber: body.imo_number,
      callSign: body.call_sign,
      flag: body.flag,
      grossTonnage: body.gross_tonnage,
      netTonnage: body.net_tonnage,
      length: body.length,
      beam: body.beam,
      draft: body.draft,
      arrivalPort: body.arrival_port,
      berthId: body.berth_id,
      eta: body.eta,
      etd: body.etd,
      agent: body.agent,
      cargo: body.cargo,
      cargoWeight: body.cargo_weight,
      iidNo: body.iid_no,
      consignee: body.consignee,
      remarks: body.remarks,
    }).where(eq(vessels.id, Number(params.id))).returning();
    if (updatedVessel.length === 0) {
      return NextResponse.json({ error: 'Vessel not found' }, { status: 404 });
    }
    return NextResponse.json(updatedVessel[0]);
  } catch (error) {
    console.error('Database error (PUT /api/vessels/[id]):', error);
    return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
  }
}

// DELETE /api/vessels/[id] - Delete vessel
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const deletedVessel = await db.delete(vessels).where(eq(vessels.id, Number(params.id))).returning();
    if (deletedVessel.length === 0) {
      return NextResponse.json({ error: 'Vessel not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Vessel deleted successfully' });
  } catch (error) {
    console.error('Database error (DELETE /api/vessels/[id]):', error);
    return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
  }
}