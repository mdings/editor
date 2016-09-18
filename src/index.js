import {extend} from './utils'
import caret from './caret'
import hljs from 'highlight.js'

const observer = {

    subtree: true,                  // watch mutations from children
    attributes: false,
    childList: true,               // watch when children added
    characterData: true,
    characterDataOldValue: true
}

const settings = {

}

const events = {
    
    change: null
}

class Editor {

    constructor(el, options) {
        
        const opts = options || {}
        const elm = document.querySelector(el)
        
        if (!(elm instanceof HTMLElement)) {

            throw new Error('Invalid `el` argument, HTMLElement required');
        }

        if (!(opts instanceof Object)) {
            
            throw new Error('Invalid `options` argument, object required');
        }

        if (!elm.id) {

            throw new Error('The element should have an id')
        }

        this.elm = elm
        this.selector = el
        this.settings = extend(settings, opts)

        this.elm.setAttribute('contenteditable', true)
        this.elm.style.whiteSpace = 'pre-wrap'
        
        // setup the observers
        this.observer = new MutationObserver(this.onMutate.bind(this))

        // pass in the target node, as well as the observer options
        this.observer.observe(this.elm, observer);

        this.setStartingElement()
        this.elm.focus()


        // watch for paste event
        this.elm.addEventListener('paste', this.onPaste.bind(this))
        
        this.elm.addEventListener('keydown', (e) => {

            if (e.which == 13) {

                if (caret.parent().className == 'hljs-bullet') {

                    // @TODO: make an automatic new list item
                    e.preventDefault()
                }
            }
        })

        

        return this
    }

    onMutate(mutations) {

        mutations.forEach((mutation) => {

            if (mutation.type == 'characterData') {
                
                const target = mutation.target.parentNode
                this.target = target

                if (target) {

                    // look for the closest wrapping div ('#editor > div')
                    const closest = target.closest('div')

                    if (closest) {

                        const pos = caret.get(closest)
                        this.highlight(closest)
                        caret.set(closest, pos.start)
                    }
                }
            }

            if (mutation.type == 'childList') {
                
                // only look for mutations on the parent #editor element
                if (mutation.target.id == this.elm.id) {

                    if(mutation.removedNodes.length) {

                        // check for the rigth starting element when removing nodes
                        this.setStartingElement()
                    }
                    
                    const nodes = mutation.addedNodes
                    nodes.forEach((node) => {
                        
                        // hightlight added nodes, dynamically inserted nodes via 
                        // node.innerText = blabla are not detected via characterData 
                        this.highlight(node)
                    })
                }
            }
        })
    }

    onPaste(e) {

        const paste = e.clipboardData.getData('text/plain')
        let node = e.path[0]

        if (paste) {

            this.setText(paste, node)
            e.preventDefault()
        }

    }

    highlight(node) {

        if (node) {

            this.observer.disconnect()

            let text = node.innerText
            const highlight = hljs.highlight('markdown', text, true)
            node.innerHTML = highlight.value

            this.observer.observe(this.elm, observer)

            this.trigger('change', this)
        }
    }

    setText(text, node = null) {

        if (!node) {

            // keep all content but the first element
            while (this.elm.firstChild) {

                this.elm.removeChild(this.elm.firstChild);
            }
            
            this.setStartingElement()
            node = this.elm.firstChild
        }

        // create an empty element to paste the text in
        // so it can be sanitized and escaped
        const sanitizer = document.createElement('textarea')
        sanitizer.value = text

        let blocks = sanitizer.value
            .toString()
            .split(/\f/)

        blocks.forEach((block, index) => {

            // the first blocks should be appended to the current node
            if (index == 0) {
                
                const pos = caret.get(node)
                const pre = node.innerText.substring(0, pos)
                const trail = node.innerText.substring(pos, node.innerText.length)

                node.textContent = pre + block + trail
                caret.set(node, pos.start + block.length)

            } else {

                // all the rest should be created inside a new div
                const div = document.createElement('div')
                div.textContent = block
                node.parentNode.insertBefore(div, node.nextSibling);
                node = div

                if (index == (blocks.length-1)) {

                    // set the caret to the last position in the last node
                    caret.set(node, node.innerText.length)
                }

            }
        })
    }

    getHTML() {

        return this.elm.innerHTML
    }

    getTextForStorage() {

        let textBlocks = []

        const nodes = Array.from(this.elm.childNodes)

        nodes.forEach((e) => {

            textBlocks.push(e.innerText)
        })
        
        return textBlocks.join('\f')
    }

    getText() {

        return this.elm.innerText
    }

    setStartingElement() {

        // there are no children yet so create one
        if(this.elm.firstChild == null) {

            const div = document.createElement('div')
            this.elm.appendChild(div)

        // there is a first node but it's not a div
        } else if (this.elm.firstChild.nodeName.toLowerCase() != 'div') {

            const div = document.createElement('div')
            this.elm.insertBefore(div, this.elm.firstChild)
            this.elm.firstChild.nextSibling.remove()
            caret.set(div, 0)
        } 
    }

    attach(e, callback) {

        if (events.hasOwnProperty(e)) {

            if (typeof callback == 'function') {

                events[e] = callback

            } else {

                throw new Error('Event callback must be a function');
            }

        } else {

            throw new Error('No support for the event: ' + e);
        }
    }

    on(e, callback) {
        
        // arguments = e, callback 
        this.attach.apply(this, arguments)
    }

    trigger(e, ctx, args) {

        if (events[e]) {

            events[e].apply(ctx, args)
        }

    }
}

export default Editor