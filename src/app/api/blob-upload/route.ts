import { NextRequest, NextResponse } from 'next/server';
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { isAdminRequest, isBlobConfigured } from '@/lib/adminAuth';

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];

import { ensureBlobEnv } from '@/lib/blobEnv';

export async function POST(request: NextRequest) {
  ensureBlobEnv();
  if (!isBlobConfigured()) {
    return NextResponse.json({ error: 'Úložisko súborov nie je nastavené.' }, { status: 503 });
  }

  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = (await request.json()) as HandleUploadBody;

  try {
    const result = await handleUpload({
      request,
      body,
      onBeforeGenerateToken: async (pathname) => {
        const isVideo = pathname.startsWith('blog/videos/');
        return {
          allowedContentTypes: isVideo ? VIDEO_TYPES : IMAGE_TYPES,
          maximumSizeInBytes: isVideo ? 500 * 1024 * 1024 : 15 * 1024 * 1024,
          addRandomSuffix: true,
        };
      },
    });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Nahrávanie zlyhalo' },
      { status: 400 }
    );
  }
}
