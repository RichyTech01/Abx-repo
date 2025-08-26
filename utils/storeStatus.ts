export function isStoreOpen(openTime?: string, closeTime?: string): boolean {
  if (!openTime || !closeTime) return false; // fallback

  const now = new Date();

  const [oH, oM] = openTime.split(":").map(Number);
  const [cH, cM] = closeTime.split(":").map(Number);

  const open = new Date();
  open.setHours(oH, oM, 0, 0);

  const close = new Date();
  close.setHours(cH, cM, 0, 0);

  if (close <= open) {
    // Overnight case
    if (now >= open) return true;
    return now <= close;
  }

  return now >= open && now <= close;
}
