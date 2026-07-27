/** Joins class names, dropping falsy values. Keeps a clsx dependency off the bundle. */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}
