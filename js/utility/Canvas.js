import { NULL_VECTOR } from 'classes/Vec2'

const canvas = document.getElementById('canvas-stage')
export const context = canvas.getContext('2d')

const { PI } = Math

const SHADOW_COLOR = 'rgba(0, 0, 0, .5)'
const SHADOW_OVERFLOW = 4 // px

context.lineCap = 'round'
context.lineJoin = 'round'

export default {
    clear () {
        context.clearRect(0, 0, 1e9, 1e9)
    },

    drawCircle ({ alpha = 1, x, y, radius, color = 'white', lineWidth = 2, fill }) {
        context.save()

        context.beginPath()
        context.globalAlpha = alpha
        context.lineWidth = lineWidth + SHADOW_OVERFLOW
        context.strokeStyle = SHADOW_COLOR

        context.arc(x, y, radius, 0, 2 * PI)

        context.closePath()
        context.stroke()

        context.lineWidth = lineWidth
        context.strokeStyle = color
        context.stroke()

        if (fill) {
            context.fillStyle = color
            fill && context.fill()
        }

        context.restore()
    },

    drawPoints ({ alpha = 1, points, color = 'white', lineWidth = 2 }) {
        context.save()

        context.beginPath()
        context.globalAlpha = alpha
        context.lineWidth = lineWidth + SHADOW_OVERFLOW
        context.strokeStyle = SHADOW_COLOR

        const firstPoint = points.shift()
        context.moveTo(firstPoint.x, firstPoint.y)
        points.forEach(point => {
            context.lineTo(point.x, point.y)
        })

        context.closePath()
        context.stroke()

        context.lineWidth = lineWidth
        context.strokeStyle = color
        context.stroke()

        context.restore()
    },

    drawImage ({ image, center = NULL_VECTOR, width, height, rotation }) {
        context.save()

        context.translate(center.x, center.y)
        context.rotate(rotation)
        context.drawImage(image, -width / 2, -height / 2, width, height)

        context.restore()
    },
}
