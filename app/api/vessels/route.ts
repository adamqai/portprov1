import { supabase } from '@/lib/supabaseClient';
import { NextResponse } from 'next/server';

// GET /api/vessels - List all vessels
export async function GET() {
  const { data, error } = await supabase.from('vessels').select('*');
  if (error) {
    console.error('Supabase error (GET /api/vessels):', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}

// POST /api/vessels - Add a new vessel
export async function POST(req: Request) {
  try {
    const body = await req.json();
    // TODO: Add validation here
    const { data, error } = await supabase.from('vessels').insert([
      {
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
      },
    ]).select().single();
    if (error) {
      console.error('Supabase error (POST /api/vessels):', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data);
  } catch (error) {
    console.error('Request error (POST /api/vessels):', error);
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}