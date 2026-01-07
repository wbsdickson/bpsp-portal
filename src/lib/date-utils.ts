import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import {
  add,
  format,
  formatDistanceToNowStrict,
  intervalToDuration,
  parseISO,
} from "date-fns";
dayjs.extend(utc);
dayjs.extend(timezone);

export function convertUtcToJst(utcTimeString: string) {
  if (!utcTimeString) return "";
  const utcTime = parseISO(utcTimeString);
  const jstTime = add(utcTime, { hours: 9 });
  return format(jstTime, "yyyy-MM-dd HH:mm:ss");
}

export function convertDateUtcToJst(utcTimeString: string) {
  if (!utcTimeString) return "";
  const utcTime = parseISO(utcTimeString);
  const jstTime = add(utcTime, { hours: 9 });
  return format(jstTime, "yyyy-MM-dd");
}

export function formatDateTime(timeString: string) {
  return convertUtcToJst(timeString);
}

export function formatDate(timeString: string | undefined) {
  if (!timeString) return "—";
  return convertDateUtcToJst(timeString);
}

export function formatRequestDate(timeString: string | undefined) {
  if (!timeString) return "—";
  const utcTime = parseISO(timeString);
  const jstTime = add(utcTime, { hours: 9 });
  return format(jstTime, "yyyy-MM-dd HH:mm:ss");
}

export function asDateValue(input: string | undefined) {
  if (!input) return undefined;
  const dt = new Date(input);
  if (Number.isNaN(dt.getTime())) return undefined;
  return dt;
}
export function toYmd(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
