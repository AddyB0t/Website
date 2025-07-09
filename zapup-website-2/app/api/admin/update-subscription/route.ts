import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { userId, subscriptionType } = await request.json();

    if (!userId || !subscriptionType) {
      return NextResponse.json({ error: 'Missing userId or subscriptionType' }, { status: 400 });
    }

    // Update user's subscription type in Supabase
    const { data, error } = await supabase
      .from('user_preferences')
      .update({ subscription_type: subscriptionType })
      .eq('user_id', userId)
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 