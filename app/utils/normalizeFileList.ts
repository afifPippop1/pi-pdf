export function normalizeFileList(files: FileList | null): File[] {
  return Array.from(files || []);
}
