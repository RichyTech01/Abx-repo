import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

dayjs.extend(weekOfYear);
dayjs.extend(isSameOrBefore);

export type Order = {
  id: string;
  created_at: string;
  [key: string]: any;
};

export type Section = {
  title: string;
  data: Order[];
};

export function groupOrdersByDate(orders: Order[]): Section[] {
  const today = dayjs();

  const grouped: Record<string, Order[]> = {
    "Today": [],
    "This week": [],
    "Last week": [],
    "Few weeks ago": [],
    "This month": [],
    "Last month": [],
    "Few months ago": [],
    "This year": [],
    "Last year": [],
    "Years ago": []
  };

  orders.forEach((order) => {
    const orderDate = dayjs(order.created_at);

    // Today
    if (orderDate.isSame(today, "day")) {
      grouped["Today"].push(order);
    }
    // This week (same calendar week, but not today)
    else if (orderDate.isSame(today, "week") && orderDate.isBefore(today, "day")) {
      grouped["This week"].push(order);
    }
    // Last week (previous calendar week)
    else if (orderDate.isSame(today.subtract(1, "week"), "week")) {
      grouped["Last week"].push(order);
    }
    // Few weeks ago (2-4 weeks back)
    else if (
      orderDate.isSame(today.subtract(2, "week"), "week") ||
      orderDate.isSame(today.subtract(3, "week"), "week") ||
      orderDate.isSame(today.subtract(4, "week"), "week")
    ) {
      grouped["Few weeks ago"].push(order);
    }
    // This month (same calendar month, but older than 4 weeks)
    else if (orderDate.isSame(today, "month")) {
      grouped["This month"].push(order);
    }
    // Last month (previous calendar month)
    else if (orderDate.isSame(today.subtract(1, "month"), "month")) {
      grouped["Last month"].push(order);
    }
    // Few months ago (2-6 months back)
    else if (
      orderDate.isSame(today.subtract(2, "month"), "month") ||
      orderDate.isSame(today.subtract(3, "month"), "month") ||
      orderDate.isSame(today.subtract(4, "month"), "month") ||
      orderDate.isSame(today.subtract(5, "month"), "month") ||
      orderDate.isSame(today.subtract(6, "month"), "month")
    ) {
      grouped["Few months ago"].push(order);
    }
    // This year (same calendar year, but older than 6 months)
    else if (orderDate.isSame(today, "year")) {
      grouped["This year"].push(order);
    }
    // Last year (previous calendar year)
    else if (orderDate.isSame(today.subtract(1, "year"), "year")) {
      grouped["Last year"].push(order);
    }
    // Years ago (2+ years back)
    else {
      grouped["Years ago"].push(order);
    }
  });

  return Object.keys(grouped)
    .filter((title) => grouped[title].length > 0)
    .map((title) => ({
      title,
      data: grouped[title].sort(
        (a, b) =>
          dayjs(b.created_at).valueOf() - dayjs(a.created_at).valueOf()
      ),
    }));
}