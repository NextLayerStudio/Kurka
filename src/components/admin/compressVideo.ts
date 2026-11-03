/** Client-side re-encode for smaller, web-friendly MP4 (H.264 + faststart). */

const FFMPEG_CORE_VERSION = '0.12.6';
const MAX_WIDTH = 1280;
const MAX_HEIGHT = 720;
/** Skip re-encode when already small 720p-ish MP4. */
const SKIP_MAX_BYTES = 14 * 1024 * 1024;

function readVideoMeta(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    const url = URL.createObjectURL(file);
    video.onloadedmetadata = () => {
      URL.revokeObjectURL(url);
      resolve({ width: video.videoWidth, height: video.videoHeight });
    };
    video.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Video sa nepodarilo načítať.'));
    };
    video.src = url;
  });
}

function inputExt(type: string) {
  if (type === 'video/quicktime') return 'mov';
  if (type === 'video/webm') return 'webm';
  return 'mp4';
}

let ffmpegReady: Promise<import('@ffmpeg/ffmpeg').FFmpeg> | null = null;

async function getFfmpeg() {
  if (!ffmpegReady) {
    ffmpegReady = (async () => {
      const { FFmpeg } = await import('@ffmpeg/ffmpeg');
      const { toBlobURL } = await import('@ffmpeg/util');
      const ffmpeg = new FFmpeg();
      const base = `https://unpkg.com/@ffmpeg/core@${FFMPEG_CORE_VERSION}/dist/esm`;
      await ffmpeg.load({
        coreURL: await toBlobURL(`${base}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${base}/ffmpeg-core.wasm`, 'application/wasm'),
      });
      return ffmpeg;
    })();
  }
  return ffmpegReady;
}

/**
 * Compress video for blog playback (max 720p, H.264, faststart for streaming).
 * Returns original file if compression fails or would not help.
 */
export async function compressVideoForWeb(
  file: File,
  onProgress?: (percent: number, status?: string) => void
): Promise<Blob> {
  try {
    const meta = await readVideoMeta(file);
    const fits =
      file.type === 'video/mp4' &&
      file.size <= SKIP_MAX_BYTES &&
      meta.width <= MAX_WIDTH &&
      meta.height <= MAX_HEIGHT;

    if (fits) {
      onProgress?.(100, 'Video je pripravené.');
      return file;
    }

    onProgress?.(3, 'Načítavam kompresiu videa…');
    const ffmpeg = await getFfmpeg();
    const inputName = `in.${inputExt(file.type)}`;
    const outputName = 'out.mp4';

    const { fetchFile } = await import('@ffmpeg/util');

    const progressHandler = ({ progress }: { progress: number }) => {
      const pct = Math.min(78, Math.round(8 + progress * 70));
      onProgress?.(pct, `Komprimujem… ${Math.round(progress * 100)}%`);
    };
    ffmpeg.on('progress', progressHandler);

    await ffmpeg.writeFile(inputName, await fetchFile(file));
    onProgress?.(10, 'Prekódovávam video pre web…');

    await ffmpeg.exec([
      '-i',
      inputName,
      '-vf',
      `scale='min(${MAX_WIDTH},iw)':min(${MAX_HEIGHT},ih):force_original_aspect_ratio=decrease`,
      '-c:v',
      'libx264',
      '-preset',
      'fast',
      '-crf',
      '28',
      '-pix_fmt',
      'yuv420p',
      '-c:a',
      'aac',
      '-b:a',
      '128k',
      '-movflags',
      '+faststart',
      '-y',
      outputName,
    ]);

    ffmpeg.off('progress', progressHandler);

    const out = await ffmpeg.readFile(outputName);
    await ffmpeg.deleteFile(inputName).catch(() => {});
    await ffmpeg.deleteFile(outputName).catch(() => {});

    const blob = new Blob([out as BlobPart], { type: 'video/mp4' });
    onProgress?.(80, blob.size < file.size ? 'Video zmenšené, nahrávam…' : 'Nahrávam…');
    return blob.size < file.size * 0.98 ? blob : file;
  } catch (error) {
    console.warn('Video compression failed, uploading original:', error);
    onProgress?.(80, 'Kompresia zlyhala, nahrávam pôvodné video…');
    return file;
  }
}
