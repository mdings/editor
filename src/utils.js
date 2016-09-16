export function extend(defaults, options) {

    for ( var key in options ) {

        if (Object.prototype.hasOwnProperty.call(options, key)) {

            defaults[key] = options[key];
        }
    }

    return defaults;
}

export function setStartingElement(node) {

    if ((node.innerHTML.indexOf('div') < 0)) {
        
        const div = document.createElement('div')
        div.innerHTML = '\n'
        node.innerHTML = ''
        node.appendChild(div)
    }
    
}