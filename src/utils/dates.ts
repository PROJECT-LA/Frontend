import { print } from "./print";
import dayjs from "dayjs";

export const validateDateFormat = (date: string, format: string) => {
  print(`${date} -> ${dayjs(date).format(format)}`);
  return dayjs(dayjs(date).format(format), format, true).isValid();
};
