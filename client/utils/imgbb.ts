export async function uploadToImgbb(imageBuffer: Buffer, apiKey: string, imageName?: string): Promise<string> {
  const form = new FormData()
  form.append("image", imageBuffer.toString("base64"))
  if (imageName) {
    form.append("name", imageName)
  }
  const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: "POST",
    body: form,
  })
  if (!res.ok) {
    throw new Error("Failed to upload image to imgbb")
  }
  const data = await res.json()
  if (!data.success || !data.data || !data.data.url) {
    throw new Error("Invalid response from imgbb")
  }
  return data.data.url
}
