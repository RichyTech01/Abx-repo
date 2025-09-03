import dayjs from "dayjs";

export function groupOrders(orders: any[]) {
  const today = dayjs();
  const startOfWeek = today.startOf("week");

  const todayOrders = orders.filter((o) =>
    dayjs(o.created_at).isSame(today, "day")
  );

  const thisWeekOrders = orders.filter(
    (o) =>
      dayjs(o.created_at).isAfter(startOfWeek) &&
      !dayjs(o.created_at).isSame(today, "day")
  );

  const lastWeekOrders = orders.filter((o) =>
    dayjs(o.created_at).isBefore(startOfWeek)
  );

  const sections = [];
  if (todayOrders.length) sections.push({ title: "Today", data: todayOrders });
  if (thisWeekOrders.length)
    sections.push({ title: "This week", data: thisWeekOrders });
  if (lastWeekOrders.length)
    sections.push({ title: "Last week", data: lastWeekOrders });

  return sections;
}
