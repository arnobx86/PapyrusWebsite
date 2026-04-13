import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('app_versions')
      .select('version_number, apk_url, update_type, release_notes')
      .eq('is_latest', true)
      .single();

    if (error) {
      return NextResponse.json({ error: 'No latest version found' }, { status: 404 });
    }

    return NextResponse.json({
      latest_version: data.version_number,
      download_url: data.apk_url,
      update_type: data.update_type,
      release_notes: data.release_notes,
    });
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
