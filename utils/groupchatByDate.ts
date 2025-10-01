import dayjs from "dayjs";

export const formatMessageDate = (date: string | Date) => {
  const msgDate = dayjs(date);
  const today = dayjs();

  if (msgDate.isSame(today, "day")) return "Today";
  if (msgDate.isSame(today.subtract(1, "day"), "day")) return "Yesterday";
  return msgDate.format("MMM D, YYYY");
};
