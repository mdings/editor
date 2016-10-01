const parent = (node) => {

    const range = window.getSelection().getRangeAt(0);

    return range.startContainer.parentNode
}

const createTreeWalker = (node) => {

    return document.createTreeWalker(
        node, // define the root
        NodeFilter.SHOW_TEXT, // only textnodes
        {
            acceptNode: (node) => {

                // by default accepts all nodes that are of type text
                return NodeFilter.FILTER_ACCEPT
            }
        },
        false
    )
}

const get = (node) => {

    const treeWalker = createTreeWalker(node)
    const sel = window.getSelection()

    const pos = {

        start: 0,
        end: 0
    }

    let isBeyondStart = false

    while(treeWalker.nextNode()) {
        
        // anchorNode is where the selection starts
        if(!isBeyondStart && treeWalker.currentNode === sel.anchorNode) {

            isBeyondStart = true

            pos.start += sel.anchorOffset

            if(sel.isCollapsed) {

                pos.end = pos.start
                break
            }

        } else if(!isBeyondStart) {

            pos.start += treeWalker.currentNode.length
        }

        if(!sel.isCollapsed && treeWalker.currentNode === sel.focusNode) {

            pos.end += sel.focusOffset
            break

        } else if(!sel.isCollapsed) {

            pos.end += treeWalker.currentNode.length
        }
    }

    return pos
}

const set = (node, index) => {

    const treeWalker = createTreeWalker(node)
    let currentPos = 0

    while(treeWalker.nextNode()) {

        currentPos += treeWalker.currentNode.length

        if (currentPos >= index) {

            let prevValue = currentPos - treeWalker.currentNode.length
            let offset = index - prevValue

            const range = document.createRange()

            range.setStart(treeWalker.currentNode, offset)
            range.collapse(true)

            const sel = window.getSelection()
            sel.removeAllRanges()
            sel.addRange(range)

            break
        }
    }
}

export default {
    
    get,
    set,
    parent
}