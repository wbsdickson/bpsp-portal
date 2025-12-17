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
