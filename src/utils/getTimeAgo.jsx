const getTimeAgo = (timestamp) => {
  const utcDate = new Date(timestamp);

  // Convert to IST (UTC +5:30)
  const istOffset = 5.5 * 60 * 60 * 1000; // 19800000 milliseconds
  const istDate = new Date(utcDate.getTime() + istOffset);

  const now = new Date();
  const seconds = Math.floor((now - istDate) / 1000);

  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "week", seconds: 604800 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
    { label: "second", seconds: 1 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count !== 1 ? "s" : ""} ago`;
    }
  }

  return "just now";
};

export default getTimeAgo;
