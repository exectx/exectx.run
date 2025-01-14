// GMT timezones, -5 for EST
export function toGMT(date: Date, offset: number) {
  const utcTime = date.getTime() + date.getTimezoneOffset() * 60000;
  return new Date(utcTime + offset * 60 * 60 * 1000);
}
