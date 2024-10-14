export function parseBox(boxString: string): [number, number, number, number] {
  const box = boxString.replace(`"BOX(`, ``).replace(`)"`, ``);

  const [minCoords, maxCoords] = box
    .split(`,`)
    .map((coords) => coords.trim().split(` `));

  const [xmin, ymin] = minCoords.map(Number);
  const [xmax, ymax] = maxCoords.map(Number);

  return [xmin, ymin, xmax, ymax];
}
