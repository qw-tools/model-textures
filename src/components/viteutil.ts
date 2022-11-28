const baseUrl = import.meta.env.BASE_URL;

export function publicUrl(url: string): string {
  return `${baseUrl}/${url}`.replace(new RegExp("//+/", "g"), "/");
}
