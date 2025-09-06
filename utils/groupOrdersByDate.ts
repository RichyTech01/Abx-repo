import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";

dayjs.extend(isBetween);

export type Order = {
  id: string;
  created_at: string;
  [key: string]: string;
};

export type Section = {
  title: string;
  data: Order[];
};

export function groupOrdersByDate(orders: Order[]): Section[] {
  const today = dayjs();
  const startOfWeek = today.startOf("week");
  const endOfWeek = today.endOf("week");

  const grouped: Record<string, Order[]> = {
    Today: [],
    "This week": [],
    "Last week": [],
  };

  orders.forEach((order) => {
    const orderDate = dayjs(order.created_at);

    if (orderDate.isSame(today, "day")) {
      grouped.Today.push(order);
    } else if (orderDate.isBetween(startOfWeek, endOfWeek, "day", "[]")) {
      grouped["This week"].push(order);
    } else if (
      orderDate.isBetween(
        startOfWeek.subtract(7, "day"),
        endOfWeek.subtract(7, "day"),
        "day",
        "[]"
      )
    ) {
      grouped["Last week"].push(order);
    }
  });

  return (Object.keys(grouped) as (keyof typeof grouped)[]).map((title) => ({
    title,
    data: grouped[title],
  }));
}
