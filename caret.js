let caretOffset

const get = (node) => {

    const range = window.getSelection().getRangeAt(0);
    const preCaretRange = range.cloneRange();

    preCaretRange.selectNodeContents(node);
    preCaretRange.setEnd(range.endContainer, range.endOffset);
    caretOffset = preCaretRange.toString().length;

    return caretOffset
}

const set = (node, pos) => {

    // loop through childnodes
    for (let node of node.childNodes) {
        
        if (node.nodeType == 3) { // text node

            if (node.length >= pos) {

                // finally add our range
                const range = document.createRange(),
                sel = window.getSelection();
                range.setStart(node,pos);
                range.collapse(true);
                sel.removeAllRanges();
                sel.addRange(range);
                return -1; // we are done

            } else {

                pos -= node.length
            }

        } else {

            pos = set(node, pos)
            if(pos == -1) {

                return -1 // no need to finish the for-loop
            }
        }
    }

    return pos // needed because of recursion
}

export default {
    
    get,
    set
}