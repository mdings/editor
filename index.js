
// @TODO: find the proper way to block the mutation observer while highlighting

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

        this.elm = elm
        this.selector = el
        this.settings = extend(settings, opts)

        this.elm.setAttribute('contenteditable', true)
        this.elm.style.whiteSpace = 'pre-wrap'
        this.elm.focus()

        // setup the observers
        this.observer = new MutationObserver(this.onMutate.bind(this))

        // pass in the target node, as well as the observer options
        this.observer.observe(this.elm, observer);

        // watch for paste event
        this.elm.addEventListener('paste', this.onPaste.bind(this))

        return this
    }

    onMutate(mutations) {

        mutations.forEach((mutation) => {

            if (mutation.type == 'characterData') {
                
                const target = mutation.target.parentNode
                this.target = target

                console.log(mutation)
                if (target) {

                    // look for the closest wrapping div ('#editor > div')
                    const closest = target.closest('div')

                    if (closest) {

                        const pos = caret.get(closest)
                        
                        this.highlight(closest)
                        caret.set(closest, pos)
                    }
                }
            }

            if (mutation.type == 'childList') {
                return
                console.log(mutation)
            }
        })
    }

    onPaste(e) {

        const paste = e.clipboardData.getData('text/plain')
        let node = e.path[0]

        if (paste) {

            this.insertText(paste, node)
            e.preventDefault()
        }

    }

    highlight(node) {

        if (node) {

            let text = node.innerText
            const highlight = hljs.highlight('markdown', text, true)

            node.innerHTML = highlight.value

            this.trigger('change', this)
        }
    }

    insertText(text, node = null) {

        text = JSON.parse(localStorage.getItem('text'))

        if (!node) {

            // stop observing while re-entering the div
            this.observer.disconnect()
            this.elm.innerHTML  = "<div></div>"
            node = this.elm.firstChild

            // reconnect the observer
            setTimeout(() => {

                this.observer.observe(this.elm, observer)
            })
            
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

                node.innerHTML = pre + block + trail
                this.highlight(node)
                caret.set(node, pos + block.length)

            } else {

                // all the rest should be created inside a new div, which will probably
                // trigger a childList mutation
                const div = document.createElement('div')
                div.innerHTML = block
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

        this.elm.childNodes.forEach((e) => {

            textBlocks.push(e.innerText)
        })
        
        return textBlocks.join('\f')
    }

    getText() {

        return this.elm.innerText
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

module.exports = Editor