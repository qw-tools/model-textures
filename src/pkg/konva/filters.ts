export function ColorizeFilter(imageData: ImageData) {
  const data = imageData.data;
  const pixelCount = data.length;
  let brightness;

  for (let i = 0; i < pixelCount; i += 4) {
    brightness = 0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2];
    data[i] += brightness; // red
    data[i + 1] += 0; // green
    data[i + 2] += 0; // blue
  }
}
