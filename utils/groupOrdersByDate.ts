import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import weekOfYear from "dayjs/plugin/weekOfYear";

dayjs.extend(isBetween);
dayjs.extend(weekOfYear);

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
  const startOfWeek = today.startOf("week");
  const endOfWeek = today.endOf("week");
  const startOfMonth = today.startOf("month");
  const startOfYear = today.startOf("year");

  // Initialize groups in order of recency
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
    const daysDiff = today.diff(orderDate, "days");
    const weeksDiff = today.diff(orderDate, "weeks");
    const monthsDiff = today.diff(orderDate, "months");
    const yearsDiff = today.diff(orderDate, "years");

    // Today
    if (orderDate.isSame(today, "day")) {
      grouped["Today"].push(order);
    }
    // This week (excluding today) - Fixed the logic here
    else if (orderDate.isBetween(startOfWeek, today.startOf("day"), "day", "[)")) {
      grouped["This week"].push(order);
    }
    // Last week
    else if (orderDate.isBetween(
      startOfWeek.subtract(1, "week"),
      endOfWeek.subtract(1, "week"),
      "day",
      "[]"
    )) {
      grouped["Last week"].push(order);
    }
    // Few weeks ago (2-4 weeks ago, but not in current month if it's been more than a month)
    else if (weeksDiff >= 2 && weeksDiff <= 4 && monthsDiff < 2) {
      grouped["Few weeks ago"].push(order);
    }
    // This month (orders from current month that are older than 4 weeks)
    else if (orderDate.isSame(today, "month") && weeksDiff > 4) {
      grouped["This month"].push(order);
    }
    // Last month
    else if (monthsDiff === 1) {
      grouped["Last month"].push(order);
    }
    // Few months ago (2-6 months ago)
    else if (monthsDiff >= 2 && monthsDiff <= 6) {
      grouped["Few months ago"].push(order);
    }
    // This year (orders from current year that are older than 6 months)
    else if (orderDate.isSame(today, "year") && monthsDiff > 6) {
      grouped["This year"].push(order);
    }
    // Last year
    else if (yearsDiff === 1) {
      grouped["Last year"].push(order);
    }
    // Years ago (2+ years)
    else if (yearsDiff >= 2) {
      grouped["Years ago"].push(order);
    }
  });

  // Filter out empty sections and maintain order
  return Object.keys(grouped)
    .filter((title) => grouped[title].length > 0)
    .map((title) => ({
      title,
      data: grouped[title].sort((a, b) =>
        dayjs(b.created_at).valueOf() - dayjs(a.created_at).valueOf()
      ),
    }));
}