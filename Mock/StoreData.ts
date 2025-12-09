// mockStoreApi.ts
export async function getMockShops(page: number) {
  const totalShops = Array.from({ length: 25 }, (_, i) => ({
    id: (i + 1).toString(),
    business_name: `Mock Shop ${i + 1}`,
    store_img:
      "https://lon1.digitaloceanspaces.com/abx-file-space/store/afronation.png",
    open_time: "08:00:00",
    close_time: "22:00:00",
    is_favorited: i % 2 === 0,
    store_rating: Math.floor(Math.random() * 5) + 1,
    distance_km: (Math.random() * 10).toFixed(1),
  }));

  const pageSize = 5;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  return {
    results: totalShops.slice(start, end),
    next: end < totalShops.length ? page + 1 : null,
    previous: page > 1 ? page - 1 : null,
  };
}
