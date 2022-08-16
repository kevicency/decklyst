export const getImageDataUri = (
  image?: Buffer | { type: 'Buffer'; data: number[] } | null,
): string | null => {
  if (!image) return null
  if ('data' in image && image.type) {
    return getImageDataUri(Buffer.from(image.data))
  }
  return `data:image/png;base64,${image.toString('base64')}`
}
