export function extend(defaults, options) {

    for ( var key in options ) {

        if (Object.prototype.hasOwnProperty.call(options, key)) {

            defaults[key] = options[key];
        }
    }

    return defaults;
}