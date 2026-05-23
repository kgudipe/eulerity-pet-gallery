export const formatBytes = (bytes: number): string => {
  if (bytes <= 0 || Number.isNaN(bytes)) {
    return '0 B';
  }

  const units = ['B', 'KB', 'MB', 'GB'];
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** exponent;
  const precision = exponent === 0 ? 0 : 1;

  return `${value.toFixed(precision)} ${units[exponent]}`;
};

export const formatDate = (isoDate: string): string => {
  const parsed = new Date(isoDate);
  if (Number.isNaN(parsed.getTime())) {
    return 'Unknown date';
  }

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(parsed);
};

export const fileNameFromPet = (title: string, id: string, imageUrl: string): string => {
  const safeTitle = (title || id)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);

  const extMatch = /\.([a-zA-Z0-9]{2,5})(?:\?|#|$)/.exec(imageUrl);
  const ext = extMatch ? `.${extMatch[1]}` : '.jpg';

  return `${safeTitle || 'pet-image'}-${id.slice(0, 8)}${ext}`;
};
