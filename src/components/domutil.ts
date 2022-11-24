// @ts-ignore
import ImageStroke from "image-stroke";

// @ts-ignore
import rotate from "image-stroke/lib/method-rotate";

export async function createImageOutline(
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

export async function createImageFromURI(
  imageURI: string
): Promise<HTMLImageElement> {
  return new Promise((resolve) => {
    const img = new Image();

    img.onload = function () {
      resolve(img);
    };

    img.src = imageURI;
  });
}

export async function dataUriFromFile(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.addEventListener("load", async () => {
      resolve(reader.result as string);
    });

    try {
      reader.readAsDataURL(file);
    } catch (e) {
      console.log("error during reader.readAsDataURL", e);
    }
  });
}
