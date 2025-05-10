/*
 * A utility function to format an ISO date string into a "time ago" style string:
 * - "just now" for less than a minute
 * - "X minutes ago" for less than an hour
 * - "X hours ago" for less than a day
 * - "X days ago" for less than a week
 * - "X weeks ago" for up to two weeks
 * - Fallback to a locale date string if older than two weeks
 */

export function formatDate(
  isoDate: string,
  locale = navigator.language
): string {
  const date = new Date(isoDate);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);

  if (diffSec < 60) {
    return 'just now';
  }

  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) {
    return `${diffMin} minute${diffMin !== 1 ? 's' : ''} ago`;
  }

  const diffHrs = Math.floor(diffMin / 60);
  if (diffHrs < 24) {
    return `${diffHrs} hour${diffHrs !== 1 ? 's' : ''} ago`;
  }

  const diffDays = Math.floor(diffHrs / 24);
  if (diffDays < 7) {
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  }

  const diffWeeks = Math.floor(diffDays / 7);
  if (diffWeeks < 2) {
    return `${diffWeeks} week${diffWeeks !== 1 ? 's' : ''} ago`;
  }

  // Older than two weeks: return formatted date
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

// Example usage:
// console.log(formatTimeAgo('2025-05-08T09:05:11Z')); // e.g. "1 day ago" or "May 8, 2025"
