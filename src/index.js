import {extend, isNode} from './utils'
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

    sectionClass: 'editor__section'
}

const events = {
    
    change: null,
    highlight: null
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
                    const closest = target.closest('.editor__section')

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
                    
                    const nodes = Array.from(mutation.addedNodes)

                    nodes.forEach((node) => {
                    
                        // if node is added check if it's actually a section
                        if(node && node.className !=  this.settings.sectionClass) {

                            if (node.nodeName.toLowerCase() != 'div') {

                                // replace the falsy section with the right node
                                const wrapper = document.createElement('div')
                                wrapper.classList.add(this.settings.sectionClass)
                                node.parentNode.insertBefore(wrapper, node);
                                
                                // trigger the childlist mutation again and then highlights the node
                                wrapper.appendChild(node);
                                node.remove()
                            
                            } else {

                                node.removeAttribute('class')
                                node.classList.add(this.settings.sectionClass)
                            }
                            

                        } else {

                            // hightlight added nodes, dynamically inserted nodes via 
                            // node.innerText = blabla are not detected via characterData
                            if (node.firstChild && node.firstChild.nodeName.toLowerCase() == 'br') {

                                node.firstChild.remove()
                            }

                            if (node.textContent.length) {
                                
                                this.highlight(node)
                            }
                        }
                    })
                }
            }
        })
    }

    onPaste(e) {

        // @TODO: paste logic should become as following:
        // - get this.elm.innerText
        // - sanitize the paste data (if the data is coming externally)
        // - convert line breaks to sections (if the data is coming externally)
        // - substite the selection (if any?, window.getSelection().toString()) from the innerText with the paste data
        // - insert text in full editor
        //  NOTE: to see if the paste data is coming externally we could create a copy event
        //  inside the editor. When the copy data is the same as the paste, the data is internal

        // this might not be the most efficient way to implement 
        // pasting but for now the lesser evil

        const paste = e.clipboardData.getData('text/plain')
        let node = e.path[0]
        
        if(window.getSelection() == paste) {

            console.log('ok')
        }

        // if (paste) {

        //     e.preventDefault()
        //     this.setText(paste, node)
        // }

    }

    highlight(node) {

        if (node) {

            this.observer.disconnect()

            // this.trigger('highlight', this, node)

            let text = node.innerText
            const highlight = hljs.highlight('markdown', text, true)
            node.innerHTML = highlight.value

            this.observer.observe(this.elm, observer)

            // this.trigger('change', this)
        }
    }

    //@TODO: create different setText methods for paste and new text
    setText(text) {

        // create an empty element to paste the text in
        // so it can be sanitized and escaped
        const sanitizer = document.createElement('textarea')
        sanitizer.value = text

        // stop the observer while creating elements or the document will freeze!
        this.observer.disconnect()
        
        const sections = sanitizer.value
            .toString()
            .split(/\f/)
        
        const fragment = document.createDocumentFragment()

        sections.forEach((section, index) => {
            
            const div = document.createElement('div')
            div.classList.add(this.settings.sectionClass, 'markdown')
            div.innerText = section
            hljs.highlightBlock(div)
            fragment.appendChild(div)
        })

        // remove all elements from the editor
        while (this.elm.firstChild) {

            this.elm.removeChild(this.elm.firstChild);
        }

        this.elm.appendChild(fragment)

        this.observer.observe(this.elm, observer)
    }

    setNode(node, value) {

        node.innerHTML = value
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
            
            events[e].call(ctx, args)
        }

    }
}

export default Editor