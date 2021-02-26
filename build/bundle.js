
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function select_option(select, value) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            if (option.__value === value) {
                option.selected = true;
                return;
            }
        }
    }
    function select_value(select) {
        const selected_option = select.querySelector(':checked') || select.options[0];
        return selected_option && selected_option.__value;
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.32.3' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = [];
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (let i = 0; i < subscribers.length; i += 1) {
                        const s = subscribers[i];
                        s[1]();
                        subscriber_queue.push(s, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.push(subscriber);
            if (subscribers.length === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                const index = subscribers.indexOf(subscriber);
                if (index !== -1) {
                    subscribers.splice(index, 1);
                }
                if (subscribers.length === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    const storedCharacters = writable([]);
    const storedTarget = writable([]);
    const storedIncorrectQuestions = writable([[], [], [], []]);
    const storedCorrectQuestions = writable(new Array(4));
    const storedIncorrectGuesses = writable([]);
    const storedCorrectGuess = writable([]);
    const emojis = ["🍔", "⏰", "👽"];

    /* src/game/Character.svelte generated by Svelte v3.32.3 */
    const file = "src/game/Character.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    // (6:2) {#each character as feature}
    function create_each_block(ctx) {
    	let t_value = emojis[/*feature*/ ctx[1]] + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*character*/ 1 && t_value !== (t_value = emojis[/*feature*/ ctx[1]] + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(6:2) {#each character as feature}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let div;
    	let each_value = /*character*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "svelte-108fzrl");
    			add_location(div, file, 4, 0, 87);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*emojis, character*/ 1) {
    				each_value = /*character*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Character", slots, []);
    	let { character } = $$props;
    	const writable_props = ["character"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Character> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("character" in $$props) $$invalidate(0, character = $$props.character);
    	};

    	$$self.$capture_state = () => ({ emojis, character });

    	$$self.$inject_state = $$props => {
    		if ("character" in $$props) $$invalidate(0, character = $$props.character);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [character];
    }

    class Character extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { character: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Character",
    			options,
    			id: create_fragment.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*character*/ ctx[0] === undefined && !("character" in props)) {
    			console.warn("<Character> was created without expected prop 'character'");
    		}
    	}

    	get character() {
    		throw new Error("<Character>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set character(value) {
    		throw new Error("<Character>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/game/Characters.svelte generated by Svelte v3.32.3 */
    const file$1 = "src/game/Characters.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	return child_ctx;
    }

    // (38:6) {#if !isPossible(character, correctQuestions, incorrectQuestions, incorrectGuesses)}
    function create_if_block(ctx) {
    	let div;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "ruled-out svelte-13yb7z3");
    			add_location(div, file$1, 38, 8, 1497);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(38:6) {#if !isPossible(character, correctQuestions, incorrectQuestions, incorrectGuesses)}",
    		ctx
    	});

    	return block;
    }

    // (36:2) {#each characters as character}
    function create_each_block$1(ctx) {
    	let div;
    	let show_if = !/*isPossible*/ ctx[4](/*character*/ ctx[6], /*correctQuestions*/ ctx[3], /*incorrectQuestions*/ ctx[1], /*incorrectGuesses*/ ctx[2]);
    	let t0;
    	let character;
    	let t1;
    	let current;
    	let if_block = show_if && create_if_block(ctx);

    	character = new Character({
    			props: { character: /*character*/ ctx[6] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			t0 = space();
    			create_component(character.$$.fragment);
    			t1 = space();
    			attr_dev(div, "class", "wrapper svelte-13yb7z3");
    			add_location(div, file$1, 36, 4, 1376);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    			append_dev(div, t0);
    			mount_component(character, div, null);
    			append_dev(div, t1);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*characters, correctQuestions, incorrectQuestions, incorrectGuesses*/ 15) show_if = !/*isPossible*/ ctx[4](/*character*/ ctx[6], /*correctQuestions*/ ctx[3], /*incorrectQuestions*/ ctx[1], /*incorrectGuesses*/ ctx[2]);

    			if (show_if) {
    				if (if_block) ; else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					if_block.m(div, t0);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			const character_changes = {};
    			if (dirty & /*characters*/ 1) character_changes.character = /*character*/ ctx[6];
    			character.$set(character_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(character.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(character.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
    			destroy_component(character);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(36:2) {#each characters as character}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let div;
    	let current;
    	let each_value = /*characters*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "grid svelte-13yb7z3");
    			add_location(div, file$1, 34, 0, 1319);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*characters, isPossible, correctQuestions, incorrectQuestions, incorrectGuesses*/ 31) {
    				each_value = /*characters*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Characters", slots, []);
    	let characters;
    	storedCharacters.subscribe(value => $$invalidate(0, characters = value));
    	let incorrectQuestions;
    	storedIncorrectQuestions.subscribe(value => $$invalidate(1, incorrectQuestions = value));
    	let incorrectGuesses;
    	storedIncorrectGuesses.subscribe(value => $$invalidate(2, incorrectGuesses = value));
    	let correctQuestions;
    	storedCorrectQuestions.subscribe(value => $$invalidate(3, correctQuestions = value));

    	const isMatch = (character, guess) => {
    		if (character.length !== guess.length) return false;
    		const matches = character.filter((feature, index) => feature === guess[index]);
    		return matches.length === guess.length;
    	};

    	const isPossible = (character, correct, incorrect, guesses) => {
    		let possible = true;

    		if (correct) {
    			character.forEach((feature, index) => {
    				if (correct[index] !== undefined && feature !== correct[index] || incorrect[index].includes(feature)) {
    					possible = false;
    				}
    			});
    		}

    		if (possible) {
    			const matches = guesses.filter(guess => isMatch(character, guess));
    			possible = !matches.length;
    		}

    		return possible;
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Characters> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		storedCharacters,
    		storedCorrectQuestions,
    		storedIncorrectGuesses,
    		storedIncorrectQuestions,
    		Character,
    		characters,
    		incorrectQuestions,
    		incorrectGuesses,
    		correctQuestions,
    		isMatch,
    		isPossible
    	});

    	$$self.$inject_state = $$props => {
    		if ("characters" in $$props) $$invalidate(0, characters = $$props.characters);
    		if ("incorrectQuestions" in $$props) $$invalidate(1, incorrectQuestions = $$props.incorrectQuestions);
    		if ("incorrectGuesses" in $$props) $$invalidate(2, incorrectGuesses = $$props.incorrectGuesses);
    		if ("correctQuestions" in $$props) $$invalidate(3, correctQuestions = $$props.correctQuestions);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [characters, incorrectQuestions, incorrectGuesses, correctQuestions, isPossible];
    }

    class Characters extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Characters",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/game/Question.svelte generated by Svelte v3.32.3 */

    const file$2 = "src/game/Question.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[11] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[14] = list[i];
    	child_ctx[16] = i;
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[17] = list[i];
    	child_ctx[16] = i;
    	return child_ctx;
    }

    // (48:8) {#each positions as position, index}
    function create_each_block_2(ctx) {
    	let option;
    	let t0_value = /*position*/ ctx[17] + "";
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t0 = text(t0_value);
    			t1 = space();
    			option.__value = /*index*/ ctx[16];
    			option.value = option.__value;
    			add_location(option, file$2, 48, 10, 2164);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t0);
    			append_dev(option, t1);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(48:8) {#each positions as position, index}",
    		ctx
    	});

    	return block;
    }

    // (56:8) {#each emojis as emoji, index}
    function create_each_block_1(ctx) {
    	let option;
    	let t0_value = /*emoji*/ ctx[14] + "";
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			option = element("option");
    			t0 = text(t0_value);
    			t1 = space();
    			option.__value = /*index*/ ctx[16];
    			option.value = option.__value;
    			add_location(option, file$2, 56, 10, 2383);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t0);
    			append_dev(option, t1);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(56:8) {#each emojis as emoji, index}",
    		ctx
    	});

    	return block;
    }

    // (75:51) 
    function create_if_block_1(ctx) {
    	let p;
    	let t0;
    	let t1_value = /*positions*/ ctx[4][/*feature*/ ctx[11]] + "";
    	let t1;
    	let t2;
    	let t3_value = /*createString*/ ctx[5](/*incorrectQuestions*/ ctx[3][/*feature*/ ctx[11]]) + "";
    	let t3;
    	let t4;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text("The ");
    			t1 = text(t1_value);
    			t2 = text(" position is not ");
    			t3 = text(t3_value);
    			t4 = space();
    			attr_dev(p, "class", "svelte-1l7tjx7");
    			add_location(p, file$2, 75, 8, 2849);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);
    			append_dev(p, t2);
    			append_dev(p, t3);
    			append_dev(p, t4);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*incorrectQuestions*/ 8 && t3_value !== (t3_value = /*createString*/ ctx[5](/*incorrectQuestions*/ ctx[3][/*feature*/ ctx[11]]) + "")) set_data_dev(t3, t3_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(75:51) ",
    		ctx
    	});

    	return block;
    }

    // (69:6) {#if correctQuestions[feature] !== undefined}
    function create_if_block$1(ctx) {
    	let p;
    	let t0;
    	let t1_value = /*positions*/ ctx[4][/*feature*/ ctx[11]] + "";
    	let t1;
    	let t2;
    	let t3_value = emojis[/*correctQuestions*/ ctx[2][/*feature*/ ctx[11]]] + "";
    	let t3;
    	let t4;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text("The ");
    			t1 = text(t1_value);
    			t2 = text(" position is ");
    			t3 = text(t3_value);
    			t4 = space();
    			attr_dev(p, "class", "svelte-1l7tjx7");
    			add_location(p, file$2, 69, 8, 2665);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);
    			append_dev(p, t2);
    			append_dev(p, t3);
    			append_dev(p, t4);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*correctQuestions*/ 4 && t3_value !== (t3_value = emojis[/*correctQuestions*/ ctx[2][/*feature*/ ctx[11]]] + "")) set_data_dev(t3, t3_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(69:6) {#if correctQuestions[feature] !== undefined}",
    		ctx
    	});

    	return block;
    }

    // (68:4) {#each [0, 1, 2, 3] as feature}
    function create_each_block$2(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*correctQuestions*/ ctx[2][/*feature*/ ctx[11]] !== undefined) return create_if_block$1;
    		if (/*incorrectQuestions*/ ctx[3][/*feature*/ ctx[11]].length) return create_if_block_1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type && current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if (if_block) if_block.d(1);
    				if_block = current_block_type && current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) {
    				if_block.d(detaching);
    			}

    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(68:4) {#each [0, 1, 2, 3] as feature}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let div2;
    	let form;
    	let div0;
    	let t0;
    	let select0;
    	let t1;
    	let select1;
    	let t2;
    	let t3;
    	let button;
    	let t5;
    	let div1;
    	let mounted;
    	let dispose;
    	let each_value_2 = /*positions*/ ctx[4];
    	validate_each_argument(each_value_2);
    	let each_blocks_2 = [];

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		each_blocks_2[i] = create_each_block_2(get_each_context_2(ctx, each_value_2, i));
    	}

    	let each_value_1 = emojis;
    	validate_each_argument(each_value_1);
    	let each_blocks_1 = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks_1[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	let each_value = [0, 1, 2, 3];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < 4; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			form = element("form");
    			div0 = element("div");
    			t0 = text("Is the\n      ");
    			select0 = element("select");

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].c();
    			}

    			t1 = text("\n      position the emoji\n      ");
    			select1 = element("select");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t2 = text("\n      ?");
    			t3 = space();
    			button = element("button");
    			button.textContent = "Ask";
    			t5 = space();
    			div1 = element("div");

    			for (let i = 0; i < 4; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(select0, "class", "svelte-1l7tjx7");
    			if (/*selectedIndex*/ ctx[0] === void 0) add_render_callback(() => /*select0_change_handler*/ ctx[7].call(select0));
    			add_location(select0, file$2, 46, 6, 2073);
    			attr_dev(select1, "class", "svelte-1l7tjx7");
    			if (/*selectedEmojiIndex*/ ctx[1] === void 0) add_render_callback(() => /*select1_change_handler*/ ctx[8].call(select1));
    			add_location(select1, file$2, 54, 6, 2293);
    			add_location(div0, file$2, 44, 4, 2048);
    			attr_dev(button, "type", "submit");
    			attr_dev(button, "class", "svelte-1l7tjx7");
    			add_location(button, file$2, 63, 4, 2501);
    			attr_dev(form, "class", "svelte-1l7tjx7");
    			add_location(form, file$2, 43, 2, 1995);
    			attr_dev(div1, "class", "log svelte-1l7tjx7");
    			add_location(div1, file$2, 66, 2, 2551);
    			attr_dev(div2, "class", "wrapper svelte-1l7tjx7");
    			add_location(div2, file$2, 42, 0, 1971);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, form);
    			append_dev(form, div0);
    			append_dev(div0, t0);
    			append_dev(div0, select0);

    			for (let i = 0; i < each_blocks_2.length; i += 1) {
    				each_blocks_2[i].m(select0, null);
    			}

    			select_option(select0, /*selectedIndex*/ ctx[0]);
    			append_dev(div0, t1);
    			append_dev(div0, select1);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(select1, null);
    			}

    			select_option(select1, /*selectedEmojiIndex*/ ctx[1]);
    			append_dev(div0, t2);
    			append_dev(form, t3);
    			append_dev(form, button);
    			append_dev(div2, t5);
    			append_dev(div2, div1);

    			for (let i = 0; i < 4; i += 1) {
    				each_blocks[i].m(div1, null);
    			}

    			if (!mounted) {
    				dispose = [
    					listen_dev(select0, "change", /*select0_change_handler*/ ctx[7]),
    					listen_dev(select1, "change", /*select1_change_handler*/ ctx[8]),
    					listen_dev(form, "submit", prevent_default(/*submitQuestion*/ ctx[6]), false, true, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*positions*/ 16) {
    				each_value_2 = /*positions*/ ctx[4];
    				validate_each_argument(each_value_2);
    				let i;

    				for (i = 0; i < each_value_2.length; i += 1) {
    					const child_ctx = get_each_context_2(ctx, each_value_2, i);

    					if (each_blocks_2[i]) {
    						each_blocks_2[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_2[i] = create_each_block_2(child_ctx);
    						each_blocks_2[i].c();
    						each_blocks_2[i].m(select0, null);
    					}
    				}

    				for (; i < each_blocks_2.length; i += 1) {
    					each_blocks_2[i].d(1);
    				}

    				each_blocks_2.length = each_value_2.length;
    			}

    			if (dirty & /*selectedIndex*/ 1) {
    				select_option(select0, /*selectedIndex*/ ctx[0]);
    			}

    			if (dirty & /*emojis*/ 0) {
    				each_value_1 = emojis;
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks_1[i]) {
    						each_blocks_1[i].p(child_ctx, dirty);
    					} else {
    						each_blocks_1[i] = create_each_block_1(child_ctx);
    						each_blocks_1[i].c();
    						each_blocks_1[i].m(select1, null);
    					}
    				}

    				for (; i < each_blocks_1.length; i += 1) {
    					each_blocks_1[i].d(1);
    				}

    				each_blocks_1.length = each_value_1.length;
    			}

    			if (dirty & /*selectedEmojiIndex*/ 2) {
    				select_option(select1, /*selectedEmojiIndex*/ ctx[1]);
    			}

    			if (dirty & /*emojis, correctQuestions, positions, undefined, createString, incorrectQuestions*/ 60) {
    				each_value = [0, 1, 2, 3];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < 4; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div1, null);
    					}
    				}

    				for (; i < 4; i += 1) {
    					each_blocks[i].d(1);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			destroy_each(each_blocks_2, detaching);
    			destroy_each(each_blocks_1, detaching);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Question", slots, []);

    	var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
    		function adopt(value) {
    			return value instanceof P
    			? value
    			: new P(function (resolve) {
    						resolve(value);
    					});
    		}

    		return new (P || (P = Promise))(function (resolve, reject) {
    				function fulfilled(value) {
    					try {
    						step(generator.next(value));
    					} catch(e) {
    						reject(e);
    					}
    				}

    				function rejected(value) {
    					try {
    						step(generator["throw"](value));
    					} catch(e) {
    						reject(e);
    					}
    				}

    				function step(result) {
    					result.done
    					? resolve(result.value)
    					: adopt(result.value).then(fulfilled, rejected);
    				}

    				step((generator = generator.apply(thisArg, _arguments || [])).next());
    			});
    	};

    	const positions = ["first", "second", "third", "fourth"];
    	let selectedIndex;
    	let selectedEmojiIndex;
    	let correctQuestions;
    	storedCorrectQuestions.subscribe(value => $$invalidate(2, correctQuestions = value));
    	let incorrectQuestions;
    	storedIncorrectQuestions.subscribe(value => $$invalidate(3, incorrectQuestions = value));
    	let target;
    	storedTarget.subscribe(value => target = value);

    	const createString = incorrectQuestions => {
    		const questionEmojis = incorrectQuestions.map(question => emojis[question]);

    		return questionEmojis.length > 1
    		? questionEmojis.join(" or ")
    		: questionEmojis[0];
    	};

    	const submitQuestion = () => __awaiter(void 0, void 0, void 0, function* () {
    		const result = target[selectedIndex] === selectedEmojiIndex;

    		if (result) {
    			storedCorrectQuestions.update(value => {
    				value[selectedIndex] = selectedEmojiIndex;
    				return [...value];
    			});
    		} else if (!incorrectQuestions[selectedIndex].includes(selectedEmojiIndex)) {
    			storedIncorrectQuestions.update(value => {
    				value[selectedIndex].push(selectedEmojiIndex);
    				return [...value];
    			});
    		}
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Question> was created with unknown prop '${key}'`);
    	});

    	function select0_change_handler() {
    		selectedIndex = select_value(this);
    		$$invalidate(0, selectedIndex);
    	}

    	function select1_change_handler() {
    		selectedEmojiIndex = select_value(this);
    		$$invalidate(1, selectedEmojiIndex);
    	}

    	$$self.$capture_state = () => ({
    		__awaiter,
    		emojis,
    		storedCorrectQuestions,
    		storedIncorrectQuestions,
    		storedTarget,
    		positions,
    		selectedIndex,
    		selectedEmojiIndex,
    		correctQuestions,
    		incorrectQuestions,
    		target,
    		createString,
    		submitQuestion
    	});

    	$$self.$inject_state = $$props => {
    		if ("__awaiter" in $$props) __awaiter = $$props.__awaiter;
    		if ("selectedIndex" in $$props) $$invalidate(0, selectedIndex = $$props.selectedIndex);
    		if ("selectedEmojiIndex" in $$props) $$invalidate(1, selectedEmojiIndex = $$props.selectedEmojiIndex);
    		if ("correctQuestions" in $$props) $$invalidate(2, correctQuestions = $$props.correctQuestions);
    		if ("incorrectQuestions" in $$props) $$invalidate(3, incorrectQuestions = $$props.incorrectQuestions);
    		if ("target" in $$props) target = $$props.target;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		selectedIndex,
    		selectedEmojiIndex,
    		correctQuestions,
    		incorrectQuestions,
    		positions,
    		createString,
    		submitQuestion,
    		select0_change_handler,
    		select1_change_handler
    	];
    }

    class Question extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Question",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src/game/Guess.svelte generated by Svelte v3.32.3 */

    const file$3 = "src/game/Guess.svelte";

    // (76:2) {#if characters.length}
    function create_if_block$2(ctx) {
    	let div1;
    	let button0;
    	let t1;
    	let div0;
    	let t2_value = /*toEmojis*/ ctx[2](/*selectedCharacter*/ ctx[1]) + "";
    	let t2;
    	let t3;
    	let button1;
    	let t5;
    	let button2;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			button0 = element("button");
    			button0.textContent = `${"<"}`;
    			t1 = space();
    			div0 = element("div");
    			t2 = text(t2_value);
    			t3 = space();
    			button1 = element("button");
    			button1.textContent = `${">"}`;
    			t5 = space();
    			button2 = element("button");
    			button2.textContent = "Guess";
    			attr_dev(button0, "class", "arrow svelte-1ojgzhl");
    			add_location(button0, file$3, 77, 6, 3149);
    			attr_dev(div0, "class", "character svelte-1ojgzhl");
    			add_location(div0, file$3, 78, 6, 3227);
    			attr_dev(button1, "class", "arrow svelte-1ojgzhl");
    			add_location(button1, file$3, 81, 6, 3308);
    			attr_dev(div1, "class", "selector svelte-1ojgzhl");
    			add_location(div1, file$3, 76, 4, 3120);
    			attr_dev(button2, "class", "guess svelte-1ojgzhl");
    			attr_dev(button2, "type", "submit");
    			add_location(button2, file$3, 83, 4, 3391);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, button0);
    			append_dev(div1, t1);
    			append_dev(div1, div0);
    			append_dev(div0, t2);
    			append_dev(div1, t3);
    			append_dev(div1, button1);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, button2, anchor);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*selectPreviousCharacter*/ ctx[3], false, false, false),
    					listen_dev(button1, "click", /*selectNextCharacter*/ ctx[4], false, false, false),
    					listen_dev(button2, "click", /*submitGuess*/ ctx[5], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*selectedCharacter*/ 2 && t2_value !== (t2_value = /*toEmojis*/ ctx[2](/*selectedCharacter*/ ctx[1]) + "")) set_data_dev(t2, t2_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(button2);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(76:2) {#if characters.length}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let div;
    	let if_block = /*characters*/ ctx[0].length && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block) if_block.c();
    			attr_dev(div, "class", "wrapper svelte-1ojgzhl");
    			add_location(div, file$3, 74, 0, 3068);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block) if_block.m(div, null);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*characters*/ ctx[0].length) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$2(ctx);
    					if_block.c();
    					if_block.m(div, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Guess", slots, []);

    	var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
    		function adopt(value) {
    			return value instanceof P
    			? value
    			: new P(function (resolve) {
    						resolve(value);
    					});
    		}

    		return new (P || (P = Promise))(function (resolve, reject) {
    				function fulfilled(value) {
    					try {
    						step(generator.next(value));
    					} catch(e) {
    						reject(e);
    					}
    				}

    				function rejected(value) {
    					try {
    						step(generator["throw"](value));
    					} catch(e) {
    						reject(e);
    					}
    				}

    				function step(result) {
    					result.done
    					? resolve(result.value)
    					: adopt(result.value).then(fulfilled, rejected);
    				}

    				step((generator = generator.apply(thisArg, _arguments || [])).next());
    			});
    	};

    	let selectedIndex;
    	let characters;
    	let possibleCharacters;
    	let selectedCharacter;
    	let incorrectQuestions;
    	storedIncorrectQuestions.subscribe(value => $$invalidate(8, incorrectQuestions = value));
    	let incorrectGuesses;
    	storedIncorrectGuesses.subscribe(value => $$invalidate(9, incorrectGuesses = value));
    	let correctQuestions;
    	storedCorrectQuestions.subscribe(value => $$invalidate(10, correctQuestions = value));
    	let target;
    	storedTarget.subscribe(value => target = value);

    	const isMatch = (character, guess) => {
    		if (character.length !== guess.length) return false;
    		const matches = character.filter((feature, index) => feature === guess[index]);
    		return matches.length === guess.length;
    	};

    	const isPossible = (character, correct, incorrect, guesses) => {
    		let possible = true;

    		if (correct) {
    			character.forEach((feature, index) => {
    				if (correct[index] !== undefined && feature !== correct[index] || incorrect[index].includes(feature)) {
    					possible = false;
    				}
    			});
    		}

    		if (possible) {
    			const matches = guesses.filter(guess => isMatch(character, guess));
    			possible = !matches.length;
    		}

    		return possible;
    	};

    	storedCharacters.subscribe(value => {
    		$$invalidate(0, characters = value);
    		$$invalidate(6, selectedIndex = 0);
    	});

    	const toEmojis = character => character.map(number => emojis[number]).join("");

    	const selectPreviousCharacter = () => {
    		if (selectedIndex > 0) {
    			$$invalidate(6, selectedIndex -= 1);
    		}
    	};

    	const selectNextCharacter = () => {
    		if (selectedIndex < characters.length - 1) {
    			$$invalidate(6, selectedIndex += 1);
    		}
    	};

    	const submitGuess = () => __awaiter(void 0, void 0, void 0, function* () {
    		const result = isMatch(target, selectedCharacter);

    		if (result) {
    			storedCorrectGuess.update(() => selectedCharacter);
    		} else {
    			storedIncorrectGuesses.update(value => [...value, selectedCharacter]);
    		}
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Guess> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		__awaiter,
    		emojis,
    		storedCharacters,
    		storedCorrectGuess,
    		storedCorrectQuestions,
    		storedIncorrectGuesses,
    		storedIncorrectQuestions,
    		storedTarget,
    		selectedIndex,
    		characters,
    		possibleCharacters,
    		selectedCharacter,
    		incorrectQuestions,
    		incorrectGuesses,
    		correctQuestions,
    		target,
    		isMatch,
    		isPossible,
    		toEmojis,
    		selectPreviousCharacter,
    		selectNextCharacter,
    		submitGuess
    	});

    	$$self.$inject_state = $$props => {
    		if ("__awaiter" in $$props) __awaiter = $$props.__awaiter;
    		if ("selectedIndex" in $$props) $$invalidate(6, selectedIndex = $$props.selectedIndex);
    		if ("characters" in $$props) $$invalidate(0, characters = $$props.characters);
    		if ("possibleCharacters" in $$props) $$invalidate(7, possibleCharacters = $$props.possibleCharacters);
    		if ("selectedCharacter" in $$props) $$invalidate(1, selectedCharacter = $$props.selectedCharacter);
    		if ("incorrectQuestions" in $$props) $$invalidate(8, incorrectQuestions = $$props.incorrectQuestions);
    		if ("incorrectGuesses" in $$props) $$invalidate(9, incorrectGuesses = $$props.incorrectGuesses);
    		if ("correctQuestions" in $$props) $$invalidate(10, correctQuestions = $$props.correctQuestions);
    		if ("target" in $$props) target = $$props.target;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*characters, correctQuestions, incorrectQuestions, incorrectGuesses*/ 1793) {
    			$$invalidate(7, possibleCharacters = characters.filter(character => isPossible(character, correctQuestions, incorrectQuestions, incorrectGuesses)));
    		}

    		if ($$self.$$.dirty & /*selectedIndex, possibleCharacters*/ 192) {
    			$$invalidate(6, selectedIndex = selectedIndex < possibleCharacters.length
    			? selectedIndex
    			: 0);
    		}

    		if ($$self.$$.dirty & /*possibleCharacters, selectedIndex*/ 192) {
    			$$invalidate(1, selectedCharacter = possibleCharacters[selectedIndex]);
    		}
    	};

    	return [
    		characters,
    		selectedCharacter,
    		toEmojis,
    		selectPreviousCharacter,
    		selectNextCharacter,
    		submitGuess,
    		selectedIndex,
    		possibleCharacters,
    		incorrectQuestions,
    		incorrectGuesses,
    		correctQuestions
    	];
    }

    class Guess extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Guess",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src/game/Game.svelte generated by Svelte v3.32.3 */
    const file$4 = "src/game/Game.svelte";

    function create_fragment$4(ctx) {
    	let div;
    	let characters;
    	let t0;
    	let question;
    	let t1;
    	let guess;
    	let current;
    	characters = new Characters({ $$inline: true });
    	question = new Question({ $$inline: true });
    	guess = new Guess({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(characters.$$.fragment);
    			t0 = space();
    			create_component(question.$$.fragment);
    			t1 = space();
    			create_component(guess.$$.fragment);
    			attr_dev(div, "class", "grid svelte-12jtuqq");
    			add_location(div, file$4, 55, 0, 2267);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(characters, div, null);
    			append_dev(div, t0);
    			mount_component(question, div, null);
    			append_dev(div, t1);
    			mount_component(guess, div, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(characters.$$.fragment, local);
    			transition_in(question.$$.fragment, local);
    			transition_in(guess.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(characters.$$.fragment, local);
    			transition_out(question.$$.fragment, local);
    			transition_out(guess.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(characters);
    			destroy_component(question);
    			destroy_component(guess);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Game", slots, []);

    	var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
    		function adopt(value) {
    			return value instanceof P
    			? value
    			: new P(function (resolve) {
    						resolve(value);
    					});
    		}

    		return new (P || (P = Promise))(function (resolve, reject) {
    				function fulfilled(value) {
    					try {
    						step(generator.next(value));
    					} catch(e) {
    						reject(e);
    					}
    				}

    				function rejected(value) {
    					try {
    						step(generator["throw"](value));
    					} catch(e) {
    						reject(e);
    					}
    				}

    				function step(result) {
    					result.done
    					? resolve(result.value)
    					: adopt(result.value).then(fulfilled, rejected);
    				}

    				step((generator = generator.apply(thisArg, _arguments || [])).next());
    			});
    	};

    	let { params } = $$props;

    	const id = params === null || params === void 0
    	? void 0
    	: params.id;

    	const generateOptions = () => {
    		const options = [];
    		const features = [0, 1, 2];

    		for (const firstFeature of features) {
    			for (const secondFeature of features) {
    				for (const thirdFeature of features) {
    					for (const fourthFeature of features) {
    						options.push([firstFeature, secondFeature, thirdFeature, fourthFeature]);
    					}
    				}
    			}
    		}

    		return options;
    	};

    	const createCharacters = () => {
    		const options = generateOptions();

    		return new Array(18).fill(null).map(() => {
    			const index = Math.floor(Math.random() * options.length);
    			const character = options[index];
    			options.splice(index, 1);
    			return character;
    		});
    	};

    	const pickTarget = characters => characters[Math.floor(Math.random() * characters.length)];

    	onMount(() => __awaiter(void 0, void 0, void 0, function* () {
    		const characters = createCharacters();

    		if (characters) {
    			const target = pickTarget(characters);
    			storedCharacters.update(() => characters);
    			storedTarget.update(() => target);
    		}
    	}));

    	const writable_props = ["params"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Game> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("params" in $$props) $$invalidate(0, params = $$props.params);
    	};

    	$$self.$capture_state = () => ({
    		__awaiter,
    		onMount,
    		storedCharacters,
    		storedTarget,
    		Characters,
    		Question,
    		Guess,
    		params,
    		id,
    		generateOptions,
    		createCharacters,
    		pickTarget
    	});

    	$$self.$inject_state = $$props => {
    		if ("__awaiter" in $$props) __awaiter = $$props.__awaiter;
    		if ("params" in $$props) $$invalidate(0, params = $$props.params);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [params, pickTarget];
    }

    class Game extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { params: 0, pickTarget: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Game",
    			options,
    			id: create_fragment$4.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*params*/ ctx[0] === undefined && !("params" in props)) {
    			console.warn("<Game> was created without expected prop 'params'");
    		}
    	}

    	get params() {
    		throw new Error("<Game>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set params(value) {
    		throw new Error("<Game>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get pickTarget() {
    		return this.$$.ctx[1];
    	}

    	set pickTarget(value) {
    		throw new Error("<Game>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/App.svelte generated by Svelte v3.32.3 */
    const file$5 = "src/App.svelte";

    function create_fragment$5(ctx) {
    	let main;
    	let game;
    	let current;
    	game = new Game({ $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(game.$$.fragment);
    			attr_dev(main, "class", "svelte-svofhh");
    			add_location(main, file$5, 3, 0, 68);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(game, main, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(game.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(game.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(game);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("App", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Game });
    	return [];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    const app = new App({
        target: document.body,
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
