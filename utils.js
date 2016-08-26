export function extend(defaults, options) {

    for ( var key in options ) {

        if (Object.prototype.hasOwnProperty.call(options, key)) {

            defaults[key] = options[key];
        }
    }

    return defaults;
}

export function escapeHTML(html) {

    return html
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;')
}