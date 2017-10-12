import GameState from './shared/GameState'

const ROAD_COLOR = 104

// do the pixels look like a road?
function looksLikeARoad(pixels) {
  const threshold = 0.35 // just to be safe
  let roadPixelsCount = 0
  for (let i = 0, n = pixels.length; i < n; i += 4) {
    if (pixels[i] === ROAD_COLOR &&
        pixels[i+1] === ROAD_COLOR &&
        pixels[i+2] === ROAD_COLOR) {
          roadPixelsCount++;
        }
  }
  const roadPixelRatio = roadPixelsCount / (pixels.length / 4)
  return roadPixelRatio > threshold
}

// given an (x,y) coordinate of a tile returns the
// possible valid directions to travel from tile (x,y)
// (i.e. where there is road) on the given map
function getValidDirections(mapImage, x, y) {
  const tileSize = mapImage.width / GameState.MAP_SIZE
  let canvas = document.createElement('canvas')
  canvas.width = tileSize
  canvas.height = tileSize
  const context = canvas.getContext('2d')

  const sourceX = tileSize * x
  const sourceY = tileSize * y
  const sourceWidth = tileSize
  const sourceHeight = tileSize
  const destWidth = canvas.width
  const destHeight = canvas.height
  const destX = 0
  const destY = 0

  context.drawImage(mapImage, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight)

  const upPixels = context.getImageData(
    tileSize / 3,
    0,
    tileSize / 3,
    tileSize / 3,
  ).data

  const downPixels = context.getImageData(
    tileSize / 3,
    tileSize * 0.67,
    tileSize / 3,
    tileSize / 3,
  ).data

  const rightPixels = context.getImageData(
    tileSize * 0.67,
    tileSize / 3,
    tileSize / 3,
    tileSize / 3,
  ).data

  const leftPixels = context.getImageData(
    0,
    tileSize / 3,
    tileSize / 3,
    tileSize / 3,
  ).data

  return {
    Up: looksLikeARoad(upPixels),
    Down: looksLikeARoad(downPixels),
    Right: looksLikeARoad(rightPixels),
    Left: looksLikeARoad(leftPixels),
  }
}

export { getValidDirections }
