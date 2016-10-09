(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("Editor", [], factory);
	else if(typeof exports === 'object')
		exports["Editor"] = factory();
	else
		root["Editor"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	var _utils = __webpack_require__(1);
	
	var _caret = __webpack_require__(2);
	
	var _caret2 = _interopRequireDefault(_caret);
	
	var _prismjs = __webpack_require__(3);
	
	var _prismjs2 = _interopRequireDefault(_prismjs);
	
	__webpack_require__(4);
	
	__webpack_require__(5);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var observer = {
	
	    subtree: true, // watch mutations from children
	    attributes: false,
	    childList: true, // watch when children added
	    characterData: true,
	    characterDataOldValue: true
	};
	
	var settings = {
	
	    sectionClass: 'editor__section'
	};
	
	var events = {
	
	    change: null,
	    highlight: null
	};
	
	var Editor = function () {
	    function Editor(el, options) {
	        _classCallCheck(this, Editor);
	
	        var opts = options || {};
	        var elm = document.querySelector(el);
	
	        if (!(elm instanceof HTMLElement)) {
	
	            throw new Error('Invalid `el` argument, HTMLElement required');
	        }
	
	        if (!(opts instanceof Object)) {
	
	            throw new Error('Invalid `options` argument, object required');
	        }
	
	        if (!elm.id) {
	
	            throw new Error('The element should have an id');
	        }
	
	        this.elm = elm;
	        this.selector = el;
	        this.settings = (0, _utils.extend)(settings, opts);
	
	        this.elm.setAttribute('contenteditable', true);
	        this.elm.style.whiteSpace = 'pre-wrap';
	
	        // setup the observers
	        this.observer = new MutationObserver(this.onMutate.bind(this));
	
	        // pass in the target node, as well as the observer options
	        this.observer.observe(this.elm, observer);
	
	        // this.setStartingElement()
	
	        this.elm.focus();
	
	        // watch for paste event
	        this.elm.addEventListener('paste', this.onPaste.bind(this));
	        // this.elm.addEventListener('k', this.onInput.bind(this), true)
	
	        // 
	
	
	        return this;
	    }
	
	    _createClass(Editor, [{
	        key: 'onMutate',
	        value: function onMutate(mutations) {
	            var _this = this;
	
	            mutations.forEach(function (mutation) {
	
	                if (mutation.type == 'characterData') {
	
	                    var target = mutation.target.parentNode;
	
	                    if (target) {
	
	                        // look for the closest wrapping div ('#editor > div')
	                        var closest = target.closest('.editor__section');
	
	                        if (closest) {
	
	                            _this.highlight(closest);
	                        }
	                    }
	                }
	
	                if (mutation.type == 'childList') {
	                    // only look for mutations on the parent #editor element
	                    if (mutation.target.id == _this.elm.id) {
	
	                        var nodes = Array.from(mutation.addedNodes);
	
	                        nodes.forEach(function (node) {
	
	                            // if node is added check if it's actually a section
	                            if (node && node.className != _this.settings.sectionClass) {
	
	                                if (node.nodeName.toLowerCase() != 'div' || !node.classList.contains(_this.settings.sectionClass)) {
	
	                                    // replace the falsy section with the right node
	                                    var wrapper = document.createElement('div');
	                                    wrapper.classList.add(_this.settings.sectionClass, 'markdown');
	                                    node.parentNode.insertBefore(wrapper, node);
	                                    // wrapper.innerText = node.textContent.length > 0 ? node.textContent : '\r'
	                                    wrapper.innerText = node.textContent;
	
	                                    _caret2.default.set(wrapper, wrapper.textContent.length);
	                                    node.remove();
	                                }
	                            }
	
	                            if (node.nodeType == 1) {
	
	                                _this.highlight(node);
	                            }
	                        });
	                    }
	                }
	            });
	        }
	    }, {
	        key: 'onPaste',
	        value: function onPaste(e) {
	
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
	
	            var paste = e.clipboardData.getData('text/plain');
	            var node = e.path[0];
	
	            if (window.getSelection() == paste) {
	
	                console.log('ok');
	            }
	
	            e.preventDefault;
	        }
	    }, {
	        key: 'highlight',
	        value: function highlight(node) {
	
	            if (node) {
	
	                this.observer.disconnect();
	                var pos = _caret2.default.get(node);
	                node.innerHTML = _prismjs2.default.highlight(node.innerText, _prismjs2.default.languages.markdown);
	                _caret2.default.set(node, pos.start);
	                this.observer.observe(this.elm, observer);
	                this.trigger('change', this);
	            }
	        }
	
	        //@TODO: create different setText methods for paste and new text
	
	    }, {
	        key: 'setText',
	        value: function setText(text) {
	            var _this2 = this;
	
	            // create an empty element to paste the text in
	            // so it can be sanitized and escaped
	            var sanitizer = document.createElement('textarea');
	            sanitizer.value = text;
	
	            // stop the observer while creating elements or the document will freeze!
	            this.observer.disconnect();
	
	            var sections = sanitizer.value.toString().split(/\f/);
	
	            var fragment = document.createDocumentFragment();
	
	            sections.forEach(function (section, index) {
	
	                var div = document.createElement('div');
	                div.classList.add(_this2.settings.sectionClass, 'markdown');
	                div.innerHTML = _prismjs2.default.highlight(section, _prismjs2.default.languages.markdown);
	                // div.innerText = section
	                // hljs.highlightBlock(div)
	                fragment.appendChild(div);
	            });
	
	            // remove all elements from the editor
	            while (this.elm.firstChild) {
	
	                this.elm.removeChild(this.elm.firstChild);
	            }
	
	            this.elm.appendChild(fragment);
	
	            this.observer.observe(this.elm, observer);
	        }
	    }, {
	        key: 'setNode',
	        value: function setNode(node, value) {
	
	            node.innerHTML = value;
	        }
	    }, {
	        key: 'getHTML',
	        value: function getHTML() {
	
	            return this.elm.innerHTML;
	        }
	    }, {
	        key: 'inView',
	        value: function inView() {}
	    }, {
	        key: 'getTextForStorage',
	        value: function getTextForStorage() {
	
	            var textBlocks = [];
	
	            var nodes = Array.from(this.elm.childNodes);
	
	            nodes.forEach(function (e) {
	
	                textBlocks.push(e.innerText);
	            });
	
	            return textBlocks.join('\f');
	        }
	    }, {
	        key: 'getText',
	        value: function getText() {
	
	            return this.elm.innerText;
	        }
	    }, {
	        key: 'getCaret',
	        value: function getCaret() {
	
	            return _caret2.default.get(this.elm);
	        }
	    }, {
	        key: 'setStartingElement',
	        value: function setStartingElement() {
	
	            // there are no children yet so create one
	            if (this.elm.firstChild == null) {
	
	                var div = document.createElement('div');
	                this.elm.appendChild(div);
	
	                // there is a first node but it's not a div
	            } else if (this.elm.firstChild.nodeName.toLowerCase() != 'div') {
	
	                var _div = document.createElement('div');
	                this.elm.insertBefore(_div, this.elm.firstChild);
	                this.elm.firstChild.nextSibling.remove();
	                _caret2.default.set(_div, 0);
	            }
	        }
	    }, {
	        key: 'attach',
	        value: function attach(e, callback) {
	
	            if (events.hasOwnProperty(e)) {
	
	                if (typeof callback == 'function') {
	
	                    events[e] = callback;
	                } else {
	
	                    throw new Error('Event callback must be a function');
	                }
	            } else {
	
	                throw new Error('No support for the event: ' + e);
	            }
	        }
	    }, {
	        key: 'on',
	        value: function on(e, callback) {
	
	            // arguments = e, callback 
	            this.attach.apply(this, arguments);
	        }
	    }, {
	        key: 'trigger',
	        value: function trigger(e, ctx, args) {
	
	            if (events[e]) {
	
	                events[e].call(ctx, args);
	            }
	        }
	    }]);
	
	    return Editor;
	}();
	
	exports.default = Editor;
	module.exports = exports['default'];

/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };
	
	exports.extend = extend;
	exports.isNode = isNode;
	function extend(defaults, options) {
	
	    for (var key in options) {
	
	        if (Object.prototype.hasOwnProperty.call(options, key)) {
	
	            defaults[key] = options[key];
	        }
	    }
	
	    return defaults;
	}
	
	function isNode(node) {
	
	    return (typeof Node === "undefined" ? "undefined" : _typeof(Node)) === "object" ? node instanceof Node : node && (typeof node === "undefined" ? "undefined" : _typeof(node)) === "object" && typeof node.nodeType === "number" && typeof node.nodeName === "string";
	}

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var parent = function parent(node) {
	
	    var range = window.getSelection().getRangeAt(0);
	
	    return range.startContainer.parentNode;
	};
	
	var createTreeWalker = function createTreeWalker(node) {
	
	    return document.createTreeWalker(node, // define the root
	    NodeFilter.SHOW_TEXT, // only textnodes
	    {
	        acceptNode: function acceptNode(node) {
	
	            // by default accepts all nodes that are of type text
	            return NodeFilter.FILTER_ACCEPT;
	        }
	    }, false);
	};
	
	var get = function get(node) {
	
	    var treeWalker = createTreeWalker(node);
	    var sel = window.getSelection();
	
	    var pos = {
	
	        start: 0,
	        end: 0
	    };
	
	    var isBeyondStart = false;
	
	    while (treeWalker.nextNode()) {
	
	        // anchorNode is where the selection starts
	        if (!isBeyondStart && treeWalker.currentNode === sel.anchorNode) {
	
	            isBeyondStart = true;
	
	            pos.start += sel.anchorOffset;
	
	            if (sel.isCollapsed) {
	
	                pos.end = pos.start;
	                break;
	            }
	        } else if (!isBeyondStart) {
	
	            pos.start += treeWalker.currentNode.length;
	        }
	
	        if (!sel.isCollapsed && treeWalker.currentNode === sel.focusNode) {
	
	            pos.end += sel.focusOffset;
	            break;
	        } else if (!sel.isCollapsed) {
	
	            pos.end += treeWalker.currentNode.length;
	        }
	    }
	
	    return pos;
	};
	
	var set = function set(node, index) {
	
	    var treeWalker = createTreeWalker(node);
	    var currentPos = 0;
	
	    while (treeWalker.nextNode()) {
	
	        currentPos += treeWalker.currentNode.length;
	
	        if (currentPos >= index) {
	
	            var prevValue = currentPos - treeWalker.currentNode.length;
	            var offset = index - prevValue;
	
	            var range = document.createRange();
	
	            range.setStart(treeWalker.currentNode, offset);
	            range.collapse(true);
	
	            var sel = window.getSelection();
	            sel.removeAllRanges();
	            sel.addRange(range);
	
	            break;
	        }
	    }
	};
	
	exports.default = {
	
	    get: get,
	    set: set,
	    parent: parent
	};
	module.exports = exports["default"];

/***/ },
/* 3 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {
	/* **********************************************
	     Begin prism-core.js
	********************************************** */
	
	var _self = (typeof window !== 'undefined')
		? window   // if in browser
		: (
			(typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope)
			? self // if in worker
			: {}   // if in node js
		);
	
	/**
	 * Prism: Lightweight, robust, elegant syntax highlighting
	 * MIT license http://www.opensource.org/licenses/mit-license.php/
	 * @author Lea Verou http://lea.verou.me
	 */
	
	var Prism = (function(){
	
	// Private helper vars
	var lang = /\blang(?:uage)?-(\w+)\b/i;
	var uniqueId = 0;
	
	var _ = _self.Prism = {
		util: {
			encode: function (tokens) {
				if (tokens instanceof Token) {
					return new Token(tokens.type, _.util.encode(tokens.content), tokens.alias);
				} else if (_.util.type(tokens) === 'Array') {
					return tokens.map(_.util.encode);
				} else {
					return tokens.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\u00a0/g, ' ');
				}
			},
	
			type: function (o) {
				return Object.prototype.toString.call(o).match(/\[object (\w+)\]/)[1];
			},
	
			objId: function (obj) {
				if (!obj['__id']) {
					Object.defineProperty(obj, '__id', { value: ++uniqueId });
				}
				return obj['__id'];
			},
	
			// Deep clone a language definition (e.g. to extend it)
			clone: function (o) {
				var type = _.util.type(o);
	
				switch (type) {
					case 'Object':
						var clone = {};
	
						for (var key in o) {
							if (o.hasOwnProperty(key)) {
								clone[key] = _.util.clone(o[key]);
							}
						}
	
						return clone;
	
					case 'Array':
						// Check for existence for IE8
						return o.map && o.map(function(v) { return _.util.clone(v); });
				}
	
				return o;
			}
		},
	
		languages: {
			extend: function (id, redef) {
				var lang = _.util.clone(_.languages[id]);
	
				for (var key in redef) {
					lang[key] = redef[key];
				}
	
				return lang;
			},
	
			/**
			 * Insert a token before another token in a language literal
			 * As this needs to recreate the object (we cannot actually insert before keys in object literals),
			 * we cannot just provide an object, we need anobject and a key.
			 * @param inside The key (or language id) of the parent
			 * @param before The key to insert before. If not provided, the function appends instead.
			 * @param insert Object with the key/value pairs to insert
			 * @param root The object that contains `inside`. If equal to Prism.languages, it can be omitted.
			 */
			insertBefore: function (inside, before, insert, root) {
				root = root || _.languages;
				var grammar = root[inside];
	
				if (arguments.length == 2) {
					insert = arguments[1];
	
					for (var newToken in insert) {
						if (insert.hasOwnProperty(newToken)) {
							grammar[newToken] = insert[newToken];
						}
					}
	
					return grammar;
				}
	
				var ret = {};
	
				for (var token in grammar) {
	
					if (grammar.hasOwnProperty(token)) {
	
						if (token == before) {
	
							for (var newToken in insert) {
	
								if (insert.hasOwnProperty(newToken)) {
									ret[newToken] = insert[newToken];
								}
							}
						}
	
						ret[token] = grammar[token];
					}
				}
	
				// Update references in other language definitions
				_.languages.DFS(_.languages, function(key, value) {
					if (value === root[inside] && key != inside) {
						this[key] = ret;
					}
				});
	
				return root[inside] = ret;
			},
	
			// Traverse a language definition with Depth First Search
			DFS: function(o, callback, type, visited) {
				visited = visited || {};
				for (var i in o) {
					if (o.hasOwnProperty(i)) {
						callback.call(o, i, o[i], type || i);
	
						if (_.util.type(o[i]) === 'Object' && !visited[_.util.objId(o[i])]) {
							visited[_.util.objId(o[i])] = true;
							_.languages.DFS(o[i], callback, null, visited);
						}
						else if (_.util.type(o[i]) === 'Array' && !visited[_.util.objId(o[i])]) {
							visited[_.util.objId(o[i])] = true;
							_.languages.DFS(o[i], callback, i, visited);
						}
					}
				}
			}
		},
		plugins: {},
	
		highlightAll: function(async, callback) {
			var env = {
				callback: callback,
				selector: 'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'
			};
	
			_.hooks.run("before-highlightall", env);
	
			var elements = env.elements || document.querySelectorAll(env.selector);
	
			for (var i=0, element; element = elements[i++];) {
				_.highlightElement(element, async === true, env.callback);
			}
		},
	
		highlightElement: function(element, async, callback) {
			// Find language
			var language, grammar, parent = element;
	
			while (parent && !lang.test(parent.className)) {
				parent = parent.parentNode;
			}
	
			if (parent) {
				language = (parent.className.match(lang) || [,''])[1].toLowerCase();
				grammar = _.languages[language];
			}
	
			// Set language on the element, if not present
			element.className = element.className.replace(lang, '').replace(/\s+/g, ' ') + ' language-' + language;
	
			// Set language on the parent, for styling
			parent = element.parentNode;
	
			if (/pre/i.test(parent.nodeName)) {
				parent.className = parent.className.replace(lang, '').replace(/\s+/g, ' ') + ' language-' + language;
			}
	
			var code = element.textContent;
	
			var env = {
				element: element,
				language: language,
				grammar: grammar,
				code: code
			};
	
			_.hooks.run('before-sanity-check', env);
	
			if (!env.code || !env.grammar) {
				_.hooks.run('complete', env);
				return;
			}
	
			_.hooks.run('before-highlight', env);
	
			if (async && _self.Worker) {
				var worker = new Worker(_.filename);
	
				worker.onmessage = function(evt) {
					env.highlightedCode = evt.data;
	
					_.hooks.run('before-insert', env);
	
					env.element.innerHTML = env.highlightedCode;
	
					callback && callback.call(env.element);
					_.hooks.run('after-highlight', env);
					_.hooks.run('complete', env);
				};
	
				worker.postMessage(JSON.stringify({
					language: env.language,
					code: env.code,
					immediateClose: true
				}));
			}
			else {
				env.highlightedCode = _.highlight(env.code, env.grammar, env.language);
	
				_.hooks.run('before-insert', env);
	
				env.element.innerHTML = env.highlightedCode;
	
				callback && callback.call(element);
	
				_.hooks.run('after-highlight', env);
				_.hooks.run('complete', env);
			}
		},
	
		highlight: function (text, grammar, language) {
			var tokens = _.tokenize(text, grammar);
			return Token.stringify(_.util.encode(tokens), language);
		},
	
		tokenize: function(text, grammar, language) {
			var Token = _.Token;
	
			var strarr = [text];
	
			var rest = grammar.rest;
	
			if (rest) {
				for (var token in rest) {
					grammar[token] = rest[token];
				}
	
				delete grammar.rest;
			}
	
			tokenloop: for (var token in grammar) {
				if(!grammar.hasOwnProperty(token) || !grammar[token]) {
					continue;
				}
	
				var patterns = grammar[token];
				patterns = (_.util.type(patterns) === "Array") ? patterns : [patterns];
	
				for (var j = 0; j < patterns.length; ++j) {
					var pattern = patterns[j],
						inside = pattern.inside,
						lookbehind = !!pattern.lookbehind,
						greedy = !!pattern.greedy,
						lookbehindLength = 0,
						alias = pattern.alias;
	
					pattern = pattern.pattern || pattern;
	
					for (var i=0; i<strarr.length; i++) { // Don’t cache length as it changes during the loop
	
						var str = strarr[i];
	
						if (strarr.length > text.length) {
							// Something went terribly wrong, ABORT, ABORT!
							break tokenloop;
						}
	
						if (str instanceof Token) {
							continue;
						}
	
						pattern.lastIndex = 0;
	
						var match = pattern.exec(str),
						    delNum = 1;
	
						// Greedy patterns can override/remove up to two previously matched tokens
						if (!match && greedy && i != strarr.length - 1) {
							// Reconstruct the original text using the next two tokens
							var nextToken = strarr[i + 1].matchedStr || strarr[i + 1],
							    combStr = str + nextToken;
	
							if (i < strarr.length - 2) {
								combStr += strarr[i + 2].matchedStr || strarr[i + 2];
							}
	
							// Try the pattern again on the reconstructed text
							pattern.lastIndex = 0;
							match = pattern.exec(combStr);
							if (!match) {
								continue;
							}
	
							var from = match.index + (lookbehind ? match[1].length : 0);
							// To be a valid candidate, the new match has to start inside of str
							if (from >= str.length) {
								continue;
							}
							var to = match.index + match[0].length,
							    len = str.length + nextToken.length;
	
							// Number of tokens to delete and replace with the new match
							delNum = 3;
	
							if (to <= len) {
								if (strarr[i + 1].greedy) {
									continue;
								}
								delNum = 2;
								combStr = combStr.slice(0, len);
							}
							str = combStr;
						}
	
						if (!match) {
							continue;
						}
	
						if(lookbehind) {
							lookbehindLength = match[1].length;
						}
	
						var from = match.index + lookbehindLength,
						    match = match[0].slice(lookbehindLength),
						    to = from + match.length,
						    before = str.slice(0, from),
						    after = str.slice(to);
	
						var args = [i, delNum];
	
						if (before) {
							args.push(before);
						}
	
						var wrapped = new Token(token, inside? _.tokenize(match, inside) : match, alias, match, greedy);
	
						args.push(wrapped);
	
						if (after) {
							args.push(after);
						}
	
						Array.prototype.splice.apply(strarr, args);
					}
				}
			}
	
			return strarr;
		},
	
		hooks: {
			all: {},
	
			add: function (name, callback) {
				var hooks = _.hooks.all;
	
				hooks[name] = hooks[name] || [];
	
				hooks[name].push(callback);
			},
	
			run: function (name, env) {
				var callbacks = _.hooks.all[name];
	
				if (!callbacks || !callbacks.length) {
					return;
				}
	
				for (var i=0, callback; callback = callbacks[i++];) {
					callback(env);
				}
			}
		}
	};
	
	var Token = _.Token = function(type, content, alias, matchedStr, greedy) {
		this.type = type;
		this.content = content;
		this.alias = alias;
		// Copy of the full string this token was created from
		this.matchedStr = matchedStr || null;
		this.greedy = !!greedy;
	};
	
	Token.stringify = function(o, language, parent) {
		if (typeof o == 'string') {
			return o;
		}
	
		if (_.util.type(o) === 'Array') {
			return o.map(function(element) {
				return Token.stringify(element, language, o);
			}).join('');
		}
	
		var env = {
			type: o.type,
			content: Token.stringify(o.content, language, parent),
			tag: 'span',
			classes: ['token', o.type],
			attributes: {},
			language: language,
			parent: parent
		};
	
		if (env.type == 'comment') {
			env.attributes['spellcheck'] = 'true';
		}
	
		if (o.alias) {
			var aliases = _.util.type(o.alias) === 'Array' ? o.alias : [o.alias];
			Array.prototype.push.apply(env.classes, aliases);
		}
	
		_.hooks.run('wrap', env);
	
		var attributes = '';
	
		for (var name in env.attributes) {
			attributes += (attributes ? ' ' : '') + name + '="' + (env.attributes[name] || '') + '"';
		}
	
		return '<' + env.tag + ' class="' + env.classes.join(' ') + '" ' + attributes + '>' + env.content + '</' + env.tag + '>';
	
	};
	
	if (!_self.document) {
		if (!_self.addEventListener) {
			// in Node.js
			return _self.Prism;
		}
	 	// In worker
		_self.addEventListener('message', function(evt) {
			var message = JSON.parse(evt.data),
			    lang = message.language,
			    code = message.code,
			    immediateClose = message.immediateClose;
	
			_self.postMessage(_.highlight(code, _.languages[lang], lang));
			if (immediateClose) {
				_self.close();
			}
		}, false);
	
		return _self.Prism;
	}
	
	//Get current script and highlight
	var script = document.currentScript || [].slice.call(document.getElementsByTagName("script")).pop();
	
	if (script) {
		_.filename = script.src;
	
		if (document.addEventListener && !script.hasAttribute('data-manual')) {
			if(document.readyState !== "loading") {
				requestAnimationFrame(_.highlightAll, 0);
			}
			else {
				document.addEventListener('DOMContentLoaded', _.highlightAll);
			}
		}
	}
	
	return _self.Prism;
	
	})();
	
	if (typeof module !== 'undefined' && module.exports) {
		module.exports = Prism;
	}
	
	// hack for components to work correctly in node.js
	if (typeof global !== 'undefined') {
		global.Prism = Prism;
	}
	
	
	/* **********************************************
	     Begin prism-markup.js
	********************************************** */
	
	Prism.languages.markup = {
		'comment': /<!--[\w\W]*?-->/,
		'prolog': /<\?[\w\W]+?\?>/,
		'doctype': /<!DOCTYPE[\w\W]+?>/,
		'cdata': /<!\[CDATA\[[\w\W]*?]]>/i,
		'tag': {
			pattern: /<\/?(?!\d)[^\s>\/=.$<]+(?:\s+[^\s>\/=]+(?:=(?:("|')(?:\\\1|\\?(?!\1)[\w\W])*\1|[^\s'">=]+))?)*\s*\/?>/i,
			inside: {
				'tag': {
					pattern: /^<\/?[^\s>\/]+/i,
					inside: {
						'punctuation': /^<\/?/,
						'namespace': /^[^\s>\/:]+:/
					}
				},
				'attr-value': {
					pattern: /=(?:('|")[\w\W]*?(\1)|[^\s>]+)/i,
					inside: {
						'punctuation': /[=>"']/
					}
				},
				'punctuation': /\/?>/,
				'attr-name': {
					pattern: /[^\s>\/]+/,
					inside: {
						'namespace': /^[^\s>\/:]+:/
					}
				}
	
			}
		},
		'entity': /&#?[\da-z]{1,8};/i
	};
	
	// Plugin to make entity title show the real entity, idea by Roman Komarov
	Prism.hooks.add('wrap', function(env) {
	
		if (env.type === 'entity') {
			env.attributes['title'] = env.content.replace(/&amp;/, '&');
		}
	});
	
	Prism.languages.xml = Prism.languages.markup;
	Prism.languages.html = Prism.languages.markup;
	Prism.languages.mathml = Prism.languages.markup;
	Prism.languages.svg = Prism.languages.markup;
	
	
	/* **********************************************
	     Begin prism-css.js
	********************************************** */
	
	Prism.languages.css = {
		'comment': /\/\*[\w\W]*?\*\//,
		'atrule': {
			pattern: /@[\w-]+?.*?(;|(?=\s*\{))/i,
			inside: {
				'rule': /@[\w-]+/
				// See rest below
			}
		},
		'url': /url\((?:(["'])(\\(?:\r\n|[\w\W])|(?!\1)[^\\\r\n])*\1|.*?)\)/i,
		'selector': /[^\{\}\s][^\{\};]*?(?=\s*\{)/,
		'string': /("|')(\\(?:\r\n|[\w\W])|(?!\1)[^\\\r\n])*\1/,
		'property': /(\b|\B)[\w-]+(?=\s*:)/i,
		'important': /\B!important\b/i,
		'function': /[-a-z0-9]+(?=\()/i,
		'punctuation': /[(){};:]/
	};
	
	Prism.languages.css['atrule'].inside.rest = Prism.util.clone(Prism.languages.css);
	
	if (Prism.languages.markup) {
		Prism.languages.insertBefore('markup', 'tag', {
			'style': {
				pattern: /(<style[\w\W]*?>)[\w\W]*?(?=<\/style>)/i,
				lookbehind: true,
				inside: Prism.languages.css,
				alias: 'language-css'
			}
		});
		
		Prism.languages.insertBefore('inside', 'attr-value', {
			'style-attr': {
				pattern: /\s*style=("|').*?\1/i,
				inside: {
					'attr-name': {
						pattern: /^\s*style/i,
						inside: Prism.languages.markup.tag.inside
					},
					'punctuation': /^\s*=\s*['"]|['"]\s*$/,
					'attr-value': {
						pattern: /.+/i,
						inside: Prism.languages.css
					}
				},
				alias: 'language-css'
			}
		}, Prism.languages.markup.tag);
	}
	
	/* **********************************************
	     Begin prism-clike.js
	********************************************** */
	
	Prism.languages.clike = {
		'comment': [
			{
				pattern: /(^|[^\\])\/\*[\w\W]*?\*\//,
				lookbehind: true
			},
			{
				pattern: /(^|[^\\:])\/\/.*/,
				lookbehind: true
			}
		],
		'string': {
			pattern: /(["'])(\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
			greedy: true
		},
		'class-name': {
			pattern: /((?:\b(?:class|interface|extends|implements|trait|instanceof|new)\s+)|(?:catch\s+\())[a-z0-9_\.\\]+/i,
			lookbehind: true,
			inside: {
				punctuation: /(\.|\\)/
			}
		},
		'keyword': /\b(if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/,
		'boolean': /\b(true|false)\b/,
		'function': /[a-z0-9_]+(?=\()/i,
		'number': /\b-?(?:0x[\da-f]+|\d*\.?\d+(?:e[+-]?\d+)?)\b/i,
		'operator': /--?|\+\+?|!=?=?|<=?|>=?|==?=?|&&?|\|\|?|\?|\*|\/|~|\^|%/,
		'punctuation': /[{}[\];(),.:]/
	};
	
	
	/* **********************************************
	     Begin prism-javascript.js
	********************************************** */
	
	Prism.languages.javascript = Prism.languages.extend('clike', {
		'keyword': /\b(as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|var|void|while|with|yield)\b/,
		'number': /\b-?(0x[\dA-Fa-f]+|0b[01]+|0o[0-7]+|\d*\.?\d+([Ee][+-]?\d+)?|NaN|Infinity)\b/,
		// Allow for all non-ASCII characters (See http://stackoverflow.com/a/2008444)
		'function': /[_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*(?=\()/i
	});
	
	Prism.languages.insertBefore('javascript', 'keyword', {
		'regex': {
			pattern: /(^|[^/])\/(?!\/)(\[.+?]|\\.|[^/\\\r\n])+\/[gimyu]{0,5}(?=\s*($|[\r\n,.;})]))/,
			lookbehind: true,
			greedy: true
		}
	});
	
	Prism.languages.insertBefore('javascript', 'string', {
		'template-string': {
			pattern: /`(?:\\\\|\\?[^\\])*?`/,
			greedy: true,
			inside: {
				'interpolation': {
					pattern: /\$\{[^}]+\}/,
					inside: {
						'interpolation-punctuation': {
							pattern: /^\$\{|\}$/,
							alias: 'punctuation'
						},
						rest: Prism.languages.javascript
					}
				},
				'string': /[\s\S]+/
			}
		}
	});
	
	if (Prism.languages.markup) {
		Prism.languages.insertBefore('markup', 'tag', {
			'script': {
				pattern: /(<script[\w\W]*?>)[\w\W]*?(?=<\/script>)/i,
				lookbehind: true,
				inside: Prism.languages.javascript,
				alias: 'language-javascript'
			}
		});
	}
	
	Prism.languages.js = Prism.languages.javascript;
	
	/* **********************************************
	     Begin prism-file-highlight.js
	********************************************** */
	
	(function () {
		if (typeof self === 'undefined' || !self.Prism || !self.document || !document.querySelector) {
			return;
		}
	
		self.Prism.fileHighlight = function() {
	
			var Extensions = {
				'js': 'javascript',
				'py': 'python',
				'rb': 'ruby',
				'ps1': 'powershell',
				'psm1': 'powershell',
				'sh': 'bash',
				'bat': 'batch',
				'h': 'c',
				'tex': 'latex'
			};
	
			if(Array.prototype.forEach) { // Check to prevent error in IE8
				Array.prototype.slice.call(document.querySelectorAll('pre[data-src]')).forEach(function (pre) {
					var src = pre.getAttribute('data-src');
	
					var language, parent = pre;
					var lang = /\blang(?:uage)?-(?!\*)(\w+)\b/i;
					while (parent && !lang.test(parent.className)) {
						parent = parent.parentNode;
					}
	
					if (parent) {
						language = (pre.className.match(lang) || [, ''])[1];
					}
	
					if (!language) {
						var extension = (src.match(/\.(\w+)$/) || [, ''])[1];
						language = Extensions[extension] || extension;
					}
	
					var code = document.createElement('code');
					code.className = 'language-' + language;
	
					pre.textContent = '';
	
					code.textContent = 'Loading…';
	
					pre.appendChild(code);
	
					var xhr = new XMLHttpRequest();
	
					xhr.open('GET', src, true);
	
					xhr.onreadystatechange = function () {
						if (xhr.readyState == 4) {
	
							if (xhr.status < 400 && xhr.responseText) {
								code.textContent = xhr.responseText;
	
								Prism.highlightElement(code);
							}
							else if (xhr.status >= 400) {
								code.textContent = '✖ Error ' + xhr.status + ' while fetching file: ' + xhr.statusText;
							}
							else {
								code.textContent = '✖ Error: File does not exist or is empty';
							}
						}
					};
	
					xhr.send(null);
				});
			}
	
		};
	
		document.addEventListener('DOMContentLoaded', self.Prism.fileHighlight);
	
	})();
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 4 */
/***/ function(module, exports) {

	Prism.languages.markdown = Prism.languages.extend('markup', {});
	Prism.languages.insertBefore('markdown', 'prolog', {
		'blockquote': {
			// > ...
			pattern: /^>(?:[\t ]*>)*/m,
			alias: 'punctuation'
		},
		'code': [
			{
				// Prefixed by 4 spaces or 1 tab
				pattern: /^(?: {4}|\t).+/m,
				alias: 'keyword'
			},
			{
				// `code`
				// ``code``
				pattern: /``.+?``|`[^`\n]+`/,
				alias: 'keyword'
			}
		],
		'title': [
			{
				// title 1
				// =======
	
				// title 2
				// -------
				pattern: /\w+.*(?:\r?\n|\r)(?:==+|--+)/,
				alias: 'important',
				inside: {
					punctuation: /==+$|--+$/
				}
			},
			{
				// # title 1
				// ###### title 6
				pattern: /(^\s*)#+.+/m,
				lookbehind: true,
				alias: 'important',
				inside: {
					punctuation: /^#+|#+$/
				}
			}
		],
		'hr': {
			// ***
			// ---
			// * * *
			// -----------
			pattern: /(^\s*)([*-])([\t ]*\2){2,}(?=\s*$)/m,
			lookbehind: true,
			alias: 'punctuation'
		},
		'list': {
			// * item
			// + item
			// - item
			// 1. item
			pattern: /(^\s*)(?:[*+-]|\d+\.)(?=[\t ].)/m,
			lookbehind: true,
			alias: 'punctuation'
		},
		'url-reference': {
			// [id]: http://example.com "Optional title"
			// [id]: http://example.com 'Optional title'
			// [id]: http://example.com (Optional title)
			// [id]: <http://example.com> "Optional title"
			pattern: /!?\[[^\]]+\]:[\t ]+(?:\S+|<(?:\\.|[^>\\])+>)(?:[\t ]+(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\((?:\\.|[^)\\])*\)))?/,
			inside: {
				'variable': {
					pattern: /^(!?\[)[^\]]+/,
					lookbehind: true
				},
				'string': /(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\((?:\\.|[^)\\])*\))$/,
				'punctuation': /^[\[\]!:]|[<>]/
			},
			alias: 'url'
		},
		'bold': {
			// **strong**
			// __strong__
	
			// Allow only one line break
			pattern: /(^|[^\\])(\*\*|__)(?:(?:\r?\n|\r)(?!\r?\n|\r)|.)+?\2/,
			lookbehind: true,
			inside: {
				'punctuation': /^\*\*|^__|\*\*$|__$/
			}
		},
		'italic': {
			// *em*
			// _em_
	
			// Allow only one line break
			pattern: /(^|[^\\])([*_])(?:(?:\r?\n|\r)(?!\r?\n|\r)|.)+?\2/,
			lookbehind: true,
			inside: {
				'punctuation': /^[*_]|[*_]$/
			}
		},
		'url': {
			// [example](http://example.com "Optional title")
			// [example] [id]
			pattern: /!?\[[^\]]+\](?:\([^\s)]+(?:[\t ]+"(?:\\.|[^"\\])*")?\)| ?\[[^\]\n]*\])/,
			inside: {
				'variable': {
					pattern: /(!?\[)[^\]]+(?=\]$)/,
					lookbehind: true
				},
				'string': {
					pattern: /"(?:\\.|[^"\\])*"(?=\)$)/
				}
			}
		}
	});
	
	Prism.languages.markdown['bold'].inside['url'] = Prism.util.clone(Prism.languages.markdown['url']);
	Prism.languages.markdown['italic'].inside['url'] = Prism.util.clone(Prism.languages.markdown['url']);
	Prism.languages.markdown['bold'].inside['italic'] = Prism.util.clone(Prism.languages.markdown['italic']);
	Prism.languages.markdown['italic'].inside['bold'] = Prism.util.clone(Prism.languages.markdown['bold']);

/***/ },
/* 5 */
/***/ function(module, exports) {

	(function () {
	
		if (typeof self === 'undefined' || !self.Prism || !self.document || !document.createRange) {
			return;
		}
	
		Prism.plugins.KeepMarkup = true;
	
		Prism.hooks.add('before-highlight', function (env) {
			if (!env.element.children.length) {
				return;
			}
	
			var pos = 0;
			var data = [];
			var f = function (elt, baseNode) {
				var o = {};
				if (!baseNode) {
					// Clone the original tag to keep all attributes
					o.clone = elt.cloneNode(false);
					o.posOpen = pos;
					data.push(o);
				}
				for (var i = 0, l = elt.childNodes.length; i < l; i++) {
					var child = elt.childNodes[i];
					if (child.nodeType === 1) { // element
						f(child);
					} else if(child.nodeType === 3) { // text
						pos += child.data.length;
					}
				}
				if (!baseNode) {
					o.posClose = pos;
				}
			};
			f(env.element, true);
	
			if (data && data.length) {
				// data is an array of all existing tags
				env.keepMarkup = data;
			}
		});
	
		Prism.hooks.add('after-highlight', function (env) {
			if(env.keepMarkup && env.keepMarkup.length) {
	
				var walk = function (elt, nodeState) {
					for (var i = 0, l = elt.childNodes.length; i < l; i++) {
	
						var child = elt.childNodes[i];
	
						if (child.nodeType === 1) { // element
							if (!walk(child, nodeState)) {
								return false;
							}
	
						} else if (child.nodeType === 3) { // text
							if(!nodeState.nodeStart && nodeState.pos + child.data.length > nodeState.node.posOpen) {
								// We found the start position
								nodeState.nodeStart = child;
								nodeState.nodeStartPos = nodeState.node.posOpen - nodeState.pos;
							}
							if(nodeState.nodeStart && nodeState.pos + child.data.length >= nodeState.node.posClose) {
								// We found the end position
								nodeState.nodeEnd = child;
								nodeState.nodeEndPos = nodeState.node.posClose - nodeState.pos;
							}
	
							nodeState.pos += child.data.length;
						}
	
						if (nodeState.nodeStart && nodeState.nodeEnd) {
							// Select the range and wrap it with the clone
							var range = document.createRange();
							range.setStart(nodeState.nodeStart, nodeState.nodeStartPos);
							range.setEnd(nodeState.nodeEnd, nodeState.nodeEndPos);
							nodeState.node.clone.appendChild(range.extractContents());
							range.insertNode(nodeState.node.clone);
							range.detach();
	
							// Process is over
							return false;
						}
					}
					return true;
				};
	
				// For each tag, we walk the DOM to reinsert it
				env.keepMarkup.forEach(function (node) {
					walk(env.element, {
						node: node,
						pos: 0
					});
				});
			}
		});
	}());


/***/ }
/******/ ])
});
;
//# sourceMappingURL=editor.js.map