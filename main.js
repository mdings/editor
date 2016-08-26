import {extend, escapeHTML} from './utils'
import caret from './caret'
import templates from './templates'

const observer = {

    subtree: true,                  // watch mutations from children
    attributes: false,
    childList: false,               // watch when children added
    characterData: true,
    characterDataOldValue: true
}

const settings = {

    regexs: [
        { pattern: /(#+)(.*)/g, template: templates.heading },
        { pattern: /((https?):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:/~+#-]*[\w@?^=%&amp;/~+#-])?)/gi, template: '<span class="url">$1</span>' },
        { pattern: /(@([a-z\d_]+))/gi, template: '<span class="mention">$1</span>' }
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

            if (!this.blocked) {

                if (mutation.type == 'characterData') {

                    const target = mutation.target.parentNode
                    this.target = target

                    if (target) {

                        // look for the closest wrapping div ('#editor > div')
                        const closest = target.closest('div')

                        this.highlight(closest)
                        
                    }
                }

                if (mutation.type == 'childList') {

                    console.log('do something with childlist')
                }
            }
        })
    }

    onPaste(e) {

        this.blocked = true
        const paste = e.clipboardData.getData('text/plain');

        if (paste) {

            // create an empty element to paste the text in
            // so it can be sanitized and escaped
            const sanitizer = document.createElement('input')
            sanitizer.value = paste

            const pos = caret.get(this.target) 
            const html = this.target.innerText
            const pastedText = escapeHTML(sanitizer.value)

        	this.target.innerHTML = html.substring(0, pos.start) + pastedText + html.substr(pos.end);
            this.highlight()
        }

        e.preventDefault()
    }

    highlight(node) {

        if (node) {

            this.blocked = true
            const pos = caret.get(node)
            let text = escapeHTML(node.innerText)

            this.settings.regexs.forEach((regex) => {

                text = text.replace(regex.pattern, regex.template)
            })

            node.innerHTML = text;
            caret.set(node, pos)

            this.trigger('change', this)
            this.blocked = false
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
    console.log(editor.getHTML())
})