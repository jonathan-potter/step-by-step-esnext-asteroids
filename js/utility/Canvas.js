const canvas = document.getElementById('canvas-stage')
const context = canvas.getContext('2d')

const { PI } = Math

export default {
    clear () {
        context.clearRect(0, 0, 1e9, 1e9)
    },

    drawCircle ({ x, y, radius, color = 'white', lineWidth = 2 }) {
        context.beginPath()
        context.lineWidth = lineWidth
        context.strokeStyle = color

        context.arc(x, y, radius, 0, 2 * PI)

        context.closePath()
        context.stroke()
    },

    drawPoints ({ alpha = 1, points, color = 'white', lineWidth = 2 }) {
        context.beginPath()
        context.globalAlpha = alpha
        context.lineWidth = lineWidth
        context.strokeStyle = color

        const firstPoint = points.shift()
        context.moveTo(firstPoint.x, firstPoint.y)
        points.forEach(point => {
            context.lineTo(point.x, point.y)
        })

        context.closePath()
        context.stroke()
    },
}
