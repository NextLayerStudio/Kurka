import { upload } from '@vercel/blob/client';

export const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
export const VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];
export const MAX_VIDEO_MB = 500;

const MAX_IMAGE_SIDE = 1600;
// Without Blob storage images are stored inline in the database, so keep them smaller.
const MAX_INLINE_IMAGE_SIDE = 1200;

export type ProgressFn = (percent: number, status?: string) => void;

function safeName(name: string) {
  const dot = name.lastIndexOf('.');
  const base = (dot > 0 ? name.slice(0, dot) : name)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 50);
  return base || 'subor';
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new window.Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Obrázok sa nepodarilo načítať.'));
    };
    img.src = url;
  });
}

async function resizeImage(file: File, maxSide: number): Promise<Blob> {
  if (file.type === 'image/gif') return file;
  const img = await loadImage(file);
  const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
  if (scale === 1 && file.size < 400 * 1024) return file;

  const canvas = document.createElement('canvas');
  canvas.width = Math.round(img.width * scale);
  canvas.height = Math.round(img.height * scale);
  const ctx = canvas.getContext('2d');
  if (!ctx) return file;
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  const type = file.type === 'image/png' ? 'image/webp' : 'image/jpeg';
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, 0.82));
  return blob && blob.size < file.size ? blob : file;
}

const toDataUrl = (blob: Blob) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Obrázok sa nepodarilo spracovať.'));
    reader.readAsDataURL(blob);
  });

export async function uploadImage(file: File, blobEnabled: boolean, onProgress?: ProgressFn): Promise<string> {
  if (!IMAGE_TYPES.includes(file.type)) {
    throw new Error('Podporované sú obrázky JPG, PNG, WebP a GIF.');
  }

  if (!blobEnabled) {
    const resized = await resizeImage(file, MAX_INLINE_IMAGE_SIDE);
    if (resized.size > 3 * 1024 * 1024) {
      throw new Error('Obrázok je príliš veľký. Zmenšite ho prosím pod 3 MB.');
    }
    onProgress?.(100);
    return toDataUrl(resized);
  }

  const resized = await resizeImage(file, MAX_IMAGE_SIDE);
  const ext = resized.type === 'image/webp' ? 'webp' : resized.type === 'image/png' ? 'png' : resized.type === 'image/gif' ? 'gif' : 'jpg';
  const result = await upload(`blog/images/${safeName(file.name)}.${ext}`, resized, {
    access: 'public',
    handleUploadUrl: '/api/blob-upload',
    contentType: resized.type,
    onUploadProgress: ({ percentage }) => onProgress?.(percentage),
  });
  return result.url;
}

export async function uploadVideo(file: File, blobEnabled: boolean, onProgress?: ProgressFn): Promise<string> {
  if (!blobEnabled) {
    throw new Error('Nahrávanie videí ešte nie je zapnuté (chýba Vercel Blob). Zatiaľ môžete vložiť odkaz na YouTube.');
  }
  if (!VIDEO_TYPES.includes(file.type)) {
    throw new Error('Podporované sú videá MP4, WebM a MOV.');
  }
  if (file.size > MAX_VIDEO_MB * 1024 * 1024) {
    throw new Error(`Video je väčšie ako ${MAX_VIDEO_MB} MB. Skúste kratšie video alebo ho nahrajte na YouTube.`);
  }

  onProgress?.(0, 'Pripravujem video…');
  const { compressVideoForWeb } = await import('./compressVideo');
  const prepared = await compressVideoForWeb(file, (pct, status) => {
    // Reserve ~80% of the bar for compression, upload uses the rest.
    onProgress?.(Math.min(80, pct), status);
  });

  const ext = prepared.type === 'video/webm' ? 'webm' : 'mp4';
  const result = await upload(`blog/videos/${safeName(file.name)}.${ext}`, prepared, {
    access: 'public',
    handleUploadUrl: '/api/blob-upload',
    contentType: prepared.type || 'video/mp4',
    multipart: prepared.size > 20 * 1024 * 1024,
    onUploadProgress: ({ percentage }) => onProgress?.(80 + percentage * 0.2, 'Nahrávam…'),
  });
  return result.url;
}
