import { NextRequest, NextResponse } from 'next/server';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest) {
  const supabase = createServerComponentClient({ cookies });

  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) return NextResponse.json({ error: error?.message || 'User not found' }, { status: 401 });

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      first_name: user.user_metadata?.first_name || '',
      last_name: user.user_metadata?.last_name || '',
      birth_date: user.user_metadata?.birth_date || '',
    }
  });
}

export async function PATCH(req: NextRequest) {
  const supabase = createServerComponentClient({ cookies });
  const body = await req.json();

  const { first_name, last_name, birth_date, new_password } = body;

  // Update user metadata
  const { data, error: updateError } = await supabase.auth.updateUser({
    password: new_password || undefined,
    data: { first_name, last_name, birth_date },
  });

  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 400 });

  return NextResponse.json({ message: 'Profile updated successfully', user: data.user });
}
