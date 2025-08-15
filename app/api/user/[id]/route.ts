import { NextRequest, NextResponse } from 'next/server';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function DELETE(req: NextRequest) {
  const supabase = createServerComponentClient({ cookies });

  const { data: { user }, error: getUserError } = await supabase.auth.getUser();
  if (getUserError || !user) return NextResponse.json({ error: 'User not found' }, { status: 401 });

  const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id);
  if (deleteError) return NextResponse.json({ error: deleteError.message }, { status: 400 });

  return NextResponse.json({ message: 'Account deleted successfully' });
}
