let caretOffset

const parent = (node) => {

    const range = window.getSelection().getRangeAt(0);

    return range.startContainer.parentNode
}


const get = (node) => {

    const range = window.getSelection().getRangeAt(0);
    const preCaretRange = range.cloneRange();

    preCaretRange.selectNodeContents(node);
    preCaretRange.setEnd(range.endContainer, range.endOffset);
    caretOffset = preCaretRange.toString().length;

    return caretOffset
}

const set = (node, pos) => {

    const children = Array.from(node.childNodes)

    // loop through childnodes
    children.forEach((n) => {
        
        if (n.nodeType == 3) { // text node

            if (n.length >= pos) {

                // finally add our range
                const range = document.createRange(),
                sel = window.getSelection();
                range.setStart(n, pos);
                range.collapse(true);
                sel.removeAllRanges();
                sel.addRange(range);
                return -1; // we are done

            } else {

                pos -= n.length
            }

        } else {

            pos = set(n, pos)

            if(pos == -1) {

                return -1 // no need to finish the for-loop
            }
        }
    })

    return pos // needed because of recursion
}

export default {
    
    get,
    set,
    parent
}