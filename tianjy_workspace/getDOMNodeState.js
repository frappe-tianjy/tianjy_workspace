// @ts-check
/**
 *
 * @param {Node} a
 * @returns
 */
export function isAdded(a) {
	let p = a.parentElement;
	while (p) {
		if (p === document.body) { return true; }
		p = p.parentElement;
	}
	return false;
}
function createMutationObserver() {
	/** @type {Map<Node, { state: boolean; add: (() => void)[]; remove: (() => void)[]; }>} */
	const map = new Map();
	const mo = new MutationObserver(() => {
		/** @type {(() => void)[][]} */
		const cb = [];
		for (const [n, c] of [...map]) {
			const newState = isAdded(n);
			if (newState === c.state) { continue; }
			c.state = newState;
			cb.push(newState ? c.add : c.remove);
			if (!newState) { map.delete(n); }
		}
		for (const fn of cb.flat()) {
			fn();
		}
	});
	mo.observe(document.body, {
		subtree: true,
		childList: true,
		attributes: false,
	});
	return [mo, map];

}
function getMutationObserverMap() {
	frappe.provide('frappe.tianjy');
	let observer = frappe.tianjy.__dom_observer;
	if (observer) { return observer[1]; }
	observer = createMutationObserver();
	frappe.tianjy.__dom_observer = observer;
	return observer[1];
}

/**
 * @template T
 * @returns {{promise: Promise<T>, resolve(v: T): void; reject(e?: any): void}}
 */
function withResolvers() {
	/** @type {() => void} */
	let resolve;
	/** @type {(v: any) => void} */
	let reject;
	/** @type {Promise<void>} */
	const promise = new Promise((res, rej) => {
		resolve = res;
		reject = rej;
	});
	// @ts-ignore
	return { promise, resolve, reject };
}
/**
 *
 * @param {Node} node
 */
export default function getDOMNodeState(node) {
	let visible = false;
	let mounted = false;
	let unmounted = false;

	/** @type {Set<(visible: boolean) => void>} */
	const visibleListeners = new Set();
	/** @param {boolean} v */
	function updateVisible(v) {
		if (v === visible) { return; }
		visible = v;
		for (const l of [...visibleListeners]) {
			l(v);
		}
	}
	const onShow = () => { updateVisible(true); };
	const onHide = () => { updateVisible(false); };
	const {promise: mountPromise, resolve: mountResolve} = withResolvers();
	const {promise: unmountPromise, resolve: unmountResolve} = withResolvers();
	const $node = $(node);
	const added = () => {
		if (unmounted || mounted) { return; }
		mounted = true;
		updateVisible(!$node.is(':hidden'));
		$node.on('show', onShow);
		$node.on('hide', onHide);
		mountResolve(true);
	};
	const removed = () => {
		if (unmounted) { return; }
		unmounted = true;
		$node.off('show', onShow);
		$node.off('hide', onHide);
		updateVisible(false);
		if (!mounted) { mountResolve(false); }
		unmountResolve(undefined);
	};
	const map = getMutationObserverMap();
	let nodeState = map.get(node);
	if (!nodeState) {
		nodeState = { state: isAdded(node), add: [], remove: [] };
		map.set(node, nodeState);
	}
	nodeState.remove.push(removed);
	if (nodeState.state) {
		added();
	} else {
		nodeState.add.push(added);
	}

	return {
		get visible() { return visible; },
		/**
		 *
		 * @param {(visible: boolean) => void} listener
		 * @returns {() => void}
		 */
		listenVisible(listener) {
			/** @type {(v: boolean) => void} */
			const fn = v => listener(v);
			visibleListeners.add(fn);
			return () => { visibleListeners.delete(fn); };
		},
		get mounted() { return mounted; },
		get unmounted() { return unmounted; },
		/**
		 * @template [TResult1=boolean]
		 * @param {((mounted: boolean) => TResult1 | PromiseLike<TResult1>)?} [fulfilled]
		 * @returns {Promise<TResult1>}
		 */

		then(fulfilled) {
			return Promise.all([mountPromise.then(fulfilled), unmountPromise]).then(v => v[0]);
		},
	};

}
