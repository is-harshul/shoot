export const formatRelativeTime = (input: string): string => {
  const value = new Date(input);
  const now = new Date();
  const diffMs = now.getTime() - value.getTime();

  const minuteMs = 60 * 1000;
  const hourMs = 60 * minuteMs;
  const dayMs = 24 * hourMs;

  if (diffMs < minuteMs) {
    return "just now";
  }

  if (diffMs < hourMs) {
    const minutes = Math.floor(diffMs / minuteMs);
    return `${minutes}m ago`;
  }

  if (diffMs < dayMs) {
    const hours = Math.floor(diffMs / hourMs);
    return `${hours}h ago`;
  }

  const days = Math.floor(diffMs / dayMs);
  return `${days}d ago`;
};

export const formatTimeOfDay = (input: string): string => {
  const value = new Date(input);
  if (Number.isNaN(value.getTime())) {
    return input;
  }
  return value.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
};
