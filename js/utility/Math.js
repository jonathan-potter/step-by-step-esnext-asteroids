// adapted from
// https://stackoverflow.com/questions/13937782/calculating-the-point-of-intersection-of-two-lines
// input: 2 line segments,
// output: the ratio (0.0-1.0) along the segment 1 where the intersection occurs / null if no intersection
// segment 1: point 1 and 2
export function getIntersectionRatioOnSegment1 (x1, y1, x2, y2, x3, y3, x4, y4) {
    var ua, ub, denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1)
    if (denom == 0) { return null }

    // ua is the ratio along segment 1
    ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denom

    // the lines intersect, but do the intersections occur along the segments?
    if (ua >= 0 && ua <= 1) {
        ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denom //ub is the ratio along segment 2
        if (ub >= 0 && ub <= 1) {
            return ua //intersections occur along both segments
        }
    }

    return null
}
