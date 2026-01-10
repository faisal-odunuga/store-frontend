import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
// Helper to create SEO friendly slug: "Product Name" + id -> "product-name-id.html"
export function createSlug(name: string, id: string) {
  const slugName = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  return `${slugName}-${id}.html`;
}

// Helper to extract ID from slug: "product-name-id.html" -> "id"
export function extractIdFromSlug(slug: string) {
  if (!slug) return '';
  // Remove .html suffix
  const cleanSlug = slug.replace(/\.html$/, '');
  // UUID is usually 36 chars. If standard UUID, we can just take the last 36 chars.
  // Or assuming the format is always name-id, we can split by - and take the last part if it was just an invalid uuid.
  // But UUIDs have dashes. So splitting by dash is risky.
  // Best bet: If we know the ID is a UUID (36 chars), take the last 36 chars.
  // But let's look at the example IDs. If they are standard UUIDs: 550e8400-e29b-41d4-a716-446655440000
  // "my-product-550e8400-e29b-41d4-a716-446655440000"

  // Regex for standard UUID (8-4-4-4-12 hex digits) at the end of string
  const uuidRegex = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  const match = cleanSlug.match(uuidRegex);

  if (match) {
    return match[0];
  }

  // Fallback: If it's not a UUID, maybe it's a different ID format.
  // If we assume the ID is the last part after the last hyphen (if no other hyphens in ID),
  // but that breaks for UUIDs if we didn't match regex.
  // Let's stick to the previous fallback of returning cleanSlug if regex fails,
  // or maybe try to interpret the last segment?
  // For now, returning cleanSlug allows "123" to work if passed directly.
  return cleanSlug;
}
