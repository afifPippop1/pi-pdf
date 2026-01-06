export function formatFileSize(size: number) {
  const units = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  let i = 0;
  while (size >= 1024) {
    size /= 1024;
    i++;
  }
  return `${size.toFixed(2)} ${units[i]}`;
}

export function checkFileSize(file: File, maxSize: number = 2 * 1024 * 1024) {
  if (file.size > maxSize) {
    return {
      error: "File size is too large. Please select a file less than 2MB.",
    };
  }
  return {
    error: null,
  };
}

export function checkSize(size: number, maxSize: number = 2 * 1024 * 1024) {
  if (size > maxSize) {
    return {
      error: "File size is too large. Please select a file less than 2MB.",
    };
  }
  return {
    error: null,
  };
}
