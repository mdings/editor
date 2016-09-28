export function extend(defaults, options) {

    for ( var key in options ) {

        if (Object.prototype.hasOwnProperty.call(options, key)) {

            defaults[key] = options[key];
        }
    }

    return defaults;
}

export function isNode(node) {

    return (
        typeof Node === "object" ? node instanceof Node : 
        node && typeof node === "object" && typeof node.nodeType === "number" && typeof node.nodeName==="string"
    );
}