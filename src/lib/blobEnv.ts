/** Vercel Blob store may inject `kurka_blob_READ_WRITE_TOKEN`; @vercel/blob expects `BLOB_READ_WRITE_TOKEN`. */
export function resolveBlobReadWriteToken(): string | undefined {
  if (process.env.BLOB_READ_WRITE_TOKEN) return process.env.BLOB_READ_WRITE_TOKEN;
  if (process.env.kurka_blob_READ_WRITE_TOKEN) return process.env.kurka_blob_READ_WRITE_TOKEN;

  for (const [key, value] of Object.entries(process.env)) {
    if (value && key.endsWith('_READ_WRITE_TOKEN') && key.toLowerCase().includes('blob')) {
      return value;
    }
  }
  return undefined;
}

/** Ensures @vercel/blob server helpers see BLOB_READ_WRITE_TOKEN. */
export function ensureBlobEnv(): void {
  if (process.env.BLOB_READ_WRITE_TOKEN) return;
  const token = resolveBlobReadWriteToken();
  if (token) process.env.BLOB_READ_WRITE_TOKEN = token;
}

export function isBlobStorageConfigured(): boolean {
  return Boolean(resolveBlobReadWriteToken());
}
