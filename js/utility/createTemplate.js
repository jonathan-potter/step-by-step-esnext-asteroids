export default function createTemplate ({ id, content}) {
    // const div = document.createElement('div')
    const template = document.createElement('template')

    template.id = id
    // div.innerHTML = content
    template.innerHTML = content

    document.body.append(template)

    return template
}
