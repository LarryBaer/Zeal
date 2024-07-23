const blue = ["#f0f9ff", "#e0f2fe", "#bae6fd", "#7dd3fc", "#38bdf8", "#0ea5e9"];
const green = ["#f0fdf4", "#dcfce7", "#bbf7d0", "#87efac", "4ade80", "#22c55e"];
const red = ["#fef2f2", "#fee2e2", "#fecaca", "#fca5a5", "#f87171", "#ef4444"];
const yellow = [
  "#fefce7",
  "#fef9c3",
  "#fef08a",
  "#fde047",
  "#facc15",
  "#eab308",
];
const purple = [
  "#fdf4ff",
  "#fae8ff",
  "#f5d0fe",
  "#f0abfc",
  "#e879f9",
  "#d946ef",
];

const thresholdMap = new Map([
  ["blue", blue],
  ["green", green],
  ["red", red],
  ["yellow", yellow],
  ["purple", purple],
]);

export default function getColorMap(
  color: string = "blue",
  habitHeatmapValues: any[]
) {
  const heatmapCounts = habitHeatmapValues.map(
    (heatmapValue: any) => heatmapValue.count
  );
  const min = Math.min(...heatmapCounts);
  const max = Math.max(...heatmapCounts);

  const thresholdOne = Math.floor(min + (max - min) * 0.1);
  const thresholdTwo = Math.floor(min + (max - min) * 0.25);
  const thresholdThree = Math.floor(min + (max - min) * 0.4);
  const thresholdFour = Math.floor(min + (max - min) * 0.65);
  const thresholdFive = Math.floor(min + (max - min) * 0.75);
  const thresholdSix = Math.floor(min + (max - min) * 0.9);

  const thresholdColors = thresholdMap.get(color);

  const colorMap: Record<number, string> = {
    [thresholdOne]: thresholdColors[0],
    [thresholdTwo]: thresholdColors[1],
    [thresholdThree]: thresholdColors[2],
    [thresholdFour]: thresholdColors[3],
    [thresholdFive]: thresholdColors[4],
    [thresholdSix]: thresholdColors[5],
  };

  return colorMap;
}
