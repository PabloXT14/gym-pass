export interface Coordinate {
  latitude: number
  longitude: number
}

export function getDistanceBetweenCoordinates(
  from: Coordinate,
  to: Coordinate,
) {
  if (from.latitude === to.latitude && from.longitude === to.longitude) {
    return 0
  }

  const fromRadians = (from.latitude * Math.PI) / 180
  const toRadians = (to.latitude * Math.PI) / 180

  const theta = from.longitude - to.longitude
  const radTheta = (theta * Math.PI) / 180

  let dist =
    Math.sin(fromRadians) * Math.sin(toRadians) +
    Math.cos(fromRadians) * Math.cos(toRadians) * Math.cos(radTheta)

  if (dist > 1) {
    dist = 1
  }

  dist = Math.acos(dist) // in radians
  dist = (dist * 180) / Math.PI // in degrees
  dist = dist * 60 * 1.1515 // 60 nautical miles per degree
  dist = dist * 1.609344 // miles to kilometers

  return dist
}
