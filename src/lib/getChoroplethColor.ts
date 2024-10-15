export default function getChoroplethColor(
  value: number,
  maxValue: number,
  minValue: number,
  minColor: [number, number, number],
  maxColor: [number, number, number],
  opacity = 1
) {
  const range = maxValue - minValue;
  const scaledValue = (value - minValue) / range;
  const color = [];
  for (let i = 0; i < 3; i++) {
    color[i] = minColor[i] + (maxColor[i] - minColor[i]) * scaledValue;
  }
  color.push(opacity);
  return color;
}
