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
