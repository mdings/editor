const heading = (text, chars, content) => {
    var level = chars.length;
    return `<span class="heading l-${level}">${text}</span>`
}

const bold = (text, chars, content) => {

    return `<span class="bold">${text}</span>`
}

const image = (text, chars, content) => {

    return `<span class="image" data-url="${content}">${text}</span>`
}

const link = (text, chars, content) => {

    return `<span class="link">${text}</span>`
}

const ul = (text, content) => {
    return `\n<span class="list-item">${text}</span>`
}

export default {

    heading,
    bold,
    image,
    link,
    ul
}