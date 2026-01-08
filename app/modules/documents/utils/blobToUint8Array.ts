export async function blobToUint8Array(blob: Blob) {
  return new Uint8Array(await blob.arrayBuffer());
}
