export function slugify(text: string): string {
  return text
    .toString() // Cast to string (optional)
    .normalize("NFKD") // The normalize() using NFKD method returns the Unicode Normalization Form of a given string.
    .toLowerCase() // Convert the string to lowercase letters
    .trim() // Remove whitespace from both sides of a string (optional)
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w-]+/g, "") // Remove all non-word chars
    .replace(/_/g, "-") // Replace _ with -
    .replace(/--+/g, "-") // Replace multiple - with single -
    .replace(/-$/g, ""); // Remove trailing -
}

// async function onTextureFileDrop(event: DragEvent): Promise<void> {
//   // prevent opening image in browser
//   event.stopPropagation();
//   event.preventDefault();
//
//   if (!event.dataTransfer) {
//     return;
//   }
//
//   await editor.setTextureByFile(event.dataTransfer.files[0]);
// }
//
// async function onTextureFileUpload(event: Event): Promise<void> {
//   const files = (event.target as HTMLInputElement).files;
//
//   if (!files) {
//     return;
//   }
//
//   await editor.setTextureByFile(files[0]);
// }
