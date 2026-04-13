import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const arch = searchParams.get('arch'); // arm, arm64, x86

    const { data, error } = await supabase
      .from('app_versions')
      .select('version_number, apk_url, apk_url_arm, apk_url_arm64, apk_url_x86, update_type, release_notes')
      .eq('is_latest', true)
      .single();

    if (error) {
      return NextResponse.json({ error: 'No latest version found' }, { status: 404 });
    }

    // Select the best URL based on architecture
    let downloadUrl = data.apk_url;
    if (arch === 'arm64' && data.apk_url_arm64) {
      downloadUrl = data.apk_url_arm64;
    } else if (arch === 'arm' && data.apk_url_arm) {
      downloadUrl = data.apk_url_arm;
    } else if (arch === 'x86' && data.apk_url_x86) {
      downloadUrl = data.apk_url_x86;
    }

    return NextResponse.json({
      latest_version: data.version_number,
      download_url: downloadUrl,
      update_type: data.update_type,
      release_notes: data.release_notes,
    });
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
