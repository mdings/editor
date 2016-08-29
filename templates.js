const heading = (text, chars, content) => {
    var level = chars.length;
    return `<span class="heading l-${level}">${text}</span>`
}

export default {

    heading
}