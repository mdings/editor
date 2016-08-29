
// @TODO: find the proper way to block the mutation observer while highlighting

import {extend, escapeHTML} from './utils'
import caret from './caret'
import templates from './templates'

const observer = {

    subtree: true,                  // watch mutations from children
    attributes: false,
    childList: true,               // watch when children added
    characterData: true,
    characterDataOldValue: true
}

const settings = {

    regexs: [
        { pattern: /(#+)(.*)/g, template: templates.heading }
    ]
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

        this.blocked = false

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

                console.log('triggering character data')
                const target = mutation.target.parentNode
                this.target = target

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

                const nodes = []

                // keep track of the added nodes
                mutation.addedNodes.forEach((node) => {

                    nodes.push(node.nodeName.toLowerCase())
                })

                // the added node is a div
                const index = nodes.indexOf('div')
                if (index > -1) {

                    mutation.addedNodes[index].innerHTML = ''
                }
            }
        })
    }

    onPaste(e) {

        const paste = e.clipboardData.getData('text/plain')
        let node = e.path[0]

        if (paste) {

            // create an empty element to paste the text in
            // so it can be sanitized and escaped
            const sanitizer = document.createElement('textarea')
            sanitizer.value = paste

            let blocks = sanitizer.value.toString().split('\n')
            
            // remove empty blocks
            blocks = blocks.filter((block) => {

                return block.length > 0
            })

            blocks.forEach((block, index) => {

                // the first blocks should be appended to the current node
                if (index == 0) {
                    
                    const pos = caret.get(node)
                    const pre = node.innerText.substring(0, pos)
                    const trail = node.innerText.substring(pos, node.innerText.length)
                    
                    node.innerHTML = pre + block + trail
                    this.highlight(node)
                    caret.set(node, pos + block.length)
                    this.blocked = false

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

            e.preventDefault()
        }

    }

    highlight(node) {

        if (node) {

            let text = escapeHTML(node.innerText)

            this.settings.regexs.forEach((regex) => {

                text = text.replace(regex.pattern, regex.template)
            })

            node.innerHTML = text;

            this.trigger('change', this)
        }
    }

    getHTML() {
        return this.elm.innerHTML
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

const editor = new Editor('#editor')
editor.on('change', () => {
    // console.log(editor.getHTML())
})