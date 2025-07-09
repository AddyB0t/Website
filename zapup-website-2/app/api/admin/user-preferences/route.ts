import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  // Fetch all user preferences from Supabase
  const { data, error } = await supabase
    .from('user_preferences')
    .select('user_id, first_name, last_name, email, subscription_type');

  if (error) {
    return NextResponse.json({ users: [], error: error.message }, { status: 500 });
  }

  return NextResponse.json({ users: data }, { status: 200 });
} 