// @ts-ignore
import ImageStroke from "image-stroke";

// @ts-ignore
import rotate from "image-stroke/lib/method-rotate";

export async function imageOutlineFromImage(
  sourceImage: HTMLImageElement,
  options: {
    thickness: number;
    color: string;
  }
): Promise<HTMLCanvasElement> {
  const imageStroke = new ImageStroke();
  imageStroke.use(rotate);

  return new Promise((resolve) => {
    const strokeCanvas: HTMLCanvasElement = imageStroke.make(
      sourceImage,
      options
    );
    const strokeContext = strokeCanvas.getContext("2d");

    if (!strokeContext) {
      return resolve(strokeCanvas);
    }

    // clip by source image to only get the stroke
    const offset = {
      x: (strokeCanvas.width - sourceImage.width) / 2,
      y: (strokeCanvas.height - sourceImage.height) / 2,
    };
    strokeContext.globalCompositeOperation = "destination-out";
    strokeContext.drawImage(sourceImage, offset.x, offset.y);

    return resolve(strokeCanvas);
  });
}
