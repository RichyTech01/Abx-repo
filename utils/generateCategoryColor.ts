export function generateCategoryColor(index: number) {
  const hueStep = 45; 
  const hue = (index * hueStep) % 360;

  const bgColor = `hsl(${hue}, 50%, 90%)`;
  const borderColor = `hsl(${hue}, 70%, 40%)`;

  return { bgColor, borderColor };
}