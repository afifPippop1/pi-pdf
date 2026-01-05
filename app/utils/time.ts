import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export function timeToNow(time: Date | string) {
  return dayjs().to(time);
}
