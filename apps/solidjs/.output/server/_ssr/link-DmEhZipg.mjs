import { I as splitProps, N as onCleanup, P as onMount, R as untrack, T as createMemo, a as escape, c as ssr, d as ssrHydrationKey, j as mergeProps, k as createSignal, n as Dynamic, t as mergeRefs, u as ssrElement, w as createEffect, x as createComponent } from "../_libs/@solid-primitives/refs+[...].mjs";
import { B as removeTrailingSlash, J as isDangerousProtocol, K as functionalUpdate, W as deepEqual, k as preloadWarning, q as hasKeys, z as exactPathTest } from "../_libs/@tanstack/router-core+[...].mjs";
import { i as useRouter } from "./ssr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/link-DmEhZipg.js
/**
* Return a boolean indicating if the JS has been hydrated already.
* When doing Server-Side Rendering, the result will always be false.
* When doing Client-Side Rendering, the result will always be false on the
* first render and true from then on. Even if a new component renders it will
* always start with true.
*
* @example
* ```tsx
* // Disable a button that needs JS to work.
* const hydrated = useHydrated()
* return (
*   <button type="button" disabled={!hydrated()} onClick={doSomethingCustom}>
*     Click me
*   </button>
* )
* ```
* @returns True if the JS has been hydrated already, false otherwise.
*/
var globalHydrated = false;
function useHydrated() {
	const [hydrated, setHydrated] = createSignal(globalHydrated);
	onMount(() => {
		globalHydrated = true;
		setHydrated(true);
	});
	return hydrated;
}
/**
* React hook to wrap `IntersectionObserver`.
*
* This hook will create an `IntersectionObserver` and observe the ref passed to it.
*
* When the intersection changes, the callback will be called with the `IntersectionObserverEntry`.
*
* @param ref - The ref to observe
* @param intersectionObserverOptions - The options to pass to the IntersectionObserver
* @param options - The options to pass to the hook
* @param callback - The callback to call when the intersection changes
* @returns The IntersectionObserver instance
* @example
* ```tsx
* const MyComponent = () => {
* const ref = React.useRef<HTMLDivElement>(null)
* useIntersectionObserver(
*  ref,
*  (entry) => { doSomething(entry) },
*  { rootMargin: '10px' },
*  { disabled: false }
* )
* return <div ref={ref} />
* ```
*/
function useIntersectionObserver(ref, callback, intersectionObserverOptions = {}, options = {}) {
	const isIntersectionObserverAvailable = typeof IntersectionObserver === "function";
	let observerRef = null;
	createEffect(() => {
		const r = ref();
		if (!r || !isIntersectionObserverAvailable || options.disabled) return;
		observerRef = new IntersectionObserver(([entry]) => {
			callback(entry);
		}, intersectionObserverOptions);
		observerRef.observe(r);
		onCleanup(() => {
			observerRef?.disconnect();
		});
	});
	return () => observerRef;
}
var _tmpl$ = [
	"<svg",
	">",
	"</svg>"
];
var timeoutMap = /* @__PURE__ */ new WeakMap();
function useLinkProps(options) {
	const router = useRouter();
	const [isTransitioning, setIsTransitioning] = createSignal(false);
	useHydrated();
	let hasRenderFetched = false;
	const [local, rest] = splitProps(mergeProps({
		activeProps: STATIC_ACTIVE_PROPS_GET,
		inactiveProps: STATIC_INACTIVE_PROPS_GET
	}, options), [
		"activeProps",
		"inactiveProps",
		"activeOptions",
		"to",
		"preload",
		"preloadDelay",
		"preloadIntentProximity",
		"hashScrollIntoView",
		"replace",
		"startTransition",
		"resetScroll",
		"viewTransition",
		"target",
		"disabled",
		"style",
		"class",
		"onClick",
		"onBlur",
		"onFocus",
		"onMouseEnter",
		"onMouseLeave",
		"onMouseOver",
		"onMouseOut",
		"onTouchStart",
		"ignoreBlocker"
	]);
	const [_, propsSafeToSpread] = splitProps(rest, [
		"params",
		"search",
		"hash",
		"state",
		"mask",
		"reloadDocument",
		"unsafeRelative",
		"from"
	]);
	const currentLocation = createMemo(() => router.stores.location.get(), void 0, { equals: (prev, next) => prev.href === next.href });
	const _options = () => options;
	const next = createMemo(() => {
		const options = {
			_fromLocation: currentLocation(),
			..._options()
		};
		return untrack(() => router.buildLocation(options));
	});
	const hrefOption = createMemo(() => {
		if (_options().disabled) return void 0;
		const location = next().maskedLocation ?? next();
		const publicHref = location.publicHref;
		if (location.external) return {
			href: publicHref,
			external: true
		};
		return {
			href: router.history.createHref(publicHref) || "/",
			external: false
		};
	});
	const externalLink = createMemo(() => {
		const _href = hrefOption();
		if (_href?.external) {
			if (isDangerousProtocol(_href.href, router.protocolAllowlist)) return;
			return _href.href;
		}
		const to = _options().to;
		if (isSafeInternal(to)) return void 0;
		if (typeof to !== "string" || to.indexOf(":") === -1) return void 0;
		try {
			new URL(to);
			if (isDangerousProtocol(to, router.protocolAllowlist)) return;
			return to;
		} catch {}
	});
	const preload = createMemo(() => {
		if (_options().reloadDocument || externalLink()) return false;
		return local.preload ?? router.options.defaultPreload;
	});
	const preloadDelay = () => local.preloadDelay ?? router.options.defaultPreloadDelay ?? 0;
	const isActive = createMemo(() => {
		if (externalLink()) return false;
		const activeOptions = local.activeOptions;
		const current = currentLocation();
		const nextLocation = next();
		if (activeOptions?.exact) {
			if (!exactPathTest(current.pathname, nextLocation.pathname, router.basepath)) return false;
		} else {
			const currentPath = removeTrailingSlash(current.pathname, router.basepath);
			const nextPath = removeTrailingSlash(nextLocation.pathname, router.basepath);
			if (!(currentPath.startsWith(nextPath) && (currentPath.length === nextPath.length || currentPath[nextPath.length] === "/"))) return false;
		}
		if (activeOptions?.includeSearch ?? true) {
			if (!deepEqual(current.search, nextLocation.search, {
				partial: !activeOptions?.exact,
				ignoreUndefined: !activeOptions?.explicitUndefined
			})) return false;
		}
		if (activeOptions?.includeHash) return current.hash === nextLocation.hash;
		return true;
	});
	const doPreload = () => router.preloadRoute({
		..._options(),
		_builtLocation: next()
	}).catch((err) => {
		console.warn(err);
		console.warn(preloadWarning);
	});
	const preloadViewportIoCallback = (entry) => {
		if (entry?.isIntersecting) doPreload();
	};
	const [ref, setRef] = createSignal(null);
	useIntersectionObserver(ref, preloadViewportIoCallback, { rootMargin: "100px" }, { disabled: !!local.disabled || !(preload() === "viewport") });
	createEffect(() => {
		if (hasRenderFetched) return;
		if (!local.disabled && preload() === "render") {
			doPreload();
			hasRenderFetched = true;
		}
	});
	if (externalLink()) return mergeProps(propsSafeToSpread, {
		ref: mergeRefs(setRef, _options().ref),
		href: externalLink()
	}, splitProps(local, [
		"target",
		"disabled",
		"style",
		"class",
		"onClick",
		"onBlur",
		"onFocus",
		"onMouseEnter",
		"onMouseLeave",
		"onMouseOut",
		"onMouseOver",
		"onTouchStart"
	])[0]);
	const handleClick = (e) => {
		const elementTarget = e.currentTarget.getAttribute("target");
		const effectiveTarget = local.target !== void 0 ? local.target : elementTarget;
		if (!local.disabled && !isCtrlEvent(e) && !e.defaultPrevented && (!effectiveTarget || effectiveTarget === "_self") && e.button === 0) {
			e.preventDefault();
			setIsTransitioning(true);
			const unsub = router.subscribe("onResolved", () => {
				unsub();
				setIsTransitioning(false);
			});
			router.navigate({
				..._options(),
				replace: local.replace,
				resetScroll: local.resetScroll,
				hashScrollIntoView: local.hashScrollIntoView,
				startTransition: local.startTransition,
				viewTransition: local.viewTransition,
				ignoreBlocker: local.ignoreBlocker
			});
		}
	};
	const enqueueIntentPreload = (e) => {
		if (local.disabled || preload() !== "intent") return;
		if (!preloadDelay()) {
			doPreload();
			return;
		}
		const eventTarget = e.currentTarget || e.target;
		if (!eventTarget || timeoutMap.has(eventTarget)) return;
		timeoutMap.set(eventTarget, setTimeout(() => {
			timeoutMap.delete(eventTarget);
			doPreload();
		}, preloadDelay()));
	};
	const handleTouchStart = (_) => {
		if (local.disabled || preload() !== "intent") return;
		doPreload();
	};
	const handleLeave = (e) => {
		if (local.disabled) return;
		const eventTarget = e.currentTarget || e.target;
		if (eventTarget) {
			const id = timeoutMap.get(eventTarget);
			clearTimeout(id);
			timeoutMap.delete(eventTarget);
		}
	};
	const simpleStyling = createMemo(() => local.activeProps === STATIC_ACTIVE_PROPS_GET && local.inactiveProps === STATIC_INACTIVE_PROPS_GET && local.class === void 0 && local.style === void 0);
	const onClick = createComposedHandler(() => local.onClick, handleClick);
	const onBlur = createComposedHandler(() => local.onBlur, handleLeave);
	const onFocus = createComposedHandler(() => local.onFocus, enqueueIntentPreload);
	const onMouseEnter = createComposedHandler(() => local.onMouseEnter, enqueueIntentPreload);
	const onMouseOver = createComposedHandler(() => local.onMouseOver, enqueueIntentPreload);
	const onMouseLeave = createComposedHandler(() => local.onMouseLeave, handleLeave);
	const onMouseOut = createComposedHandler(() => local.onMouseOut, handleLeave);
	const onTouchStart = createComposedHandler(() => local.onTouchStart, handleTouchStart);
	const resolvedProps = createMemo(() => {
		const active = isActive();
		const base = {
			href: hrefOption()?.href,
			ref: mergeRefs(setRef, _options().ref),
			onClick,
			onBlur,
			onFocus,
			onMouseEnter,
			onMouseOver,
			onMouseLeave,
			onMouseOut,
			onTouchStart,
			disabled: !!local.disabled,
			target: local.target,
			...local.disabled && STATIC_DISABLED_PROPS,
			...isTransitioning() && STATIC_TRANSITIONING_ATTRIBUTES
		};
		if (simpleStyling()) return {
			...base,
			...active && STATIC_DEFAULT_ACTIVE_ATTRIBUTES
		};
		const activeProps = active ? functionalUpdate(local.activeProps, {}) ?? EMPTY_OBJECT : EMPTY_OBJECT;
		const inactiveProps = active ? EMPTY_OBJECT : functionalUpdate(local.inactiveProps, {});
		const style = {
			...local.style,
			...activeProps.style,
			...inactiveProps.style
		};
		const className = [
			local.class,
			activeProps.class,
			inactiveProps.class
		].filter(Boolean).join(" ");
		return {
			...activeProps,
			...inactiveProps,
			...base,
			...hasKeys(style) ? { style } : void 0,
			...className ? { class: className } : void 0,
			...active && STATIC_ACTIVE_ATTRIBUTES
		};
	});
	return mergeProps(propsSafeToSpread, resolvedProps);
}
var STATIC_ACTIVE_PROPS = { class: "active" };
var STATIC_ACTIVE_PROPS_GET = () => STATIC_ACTIVE_PROPS;
var EMPTY_OBJECT = {};
var STATIC_INACTIVE_PROPS_GET = () => EMPTY_OBJECT;
var STATIC_DEFAULT_ACTIVE_ATTRIBUTES = {
	class: "active",
	"data-status": "active",
	"aria-current": "page"
};
var STATIC_DISABLED_PROPS = {
	role: "link",
	"aria-disabled": true
};
var STATIC_ACTIVE_ATTRIBUTES = {
	"data-status": "active",
	"aria-current": "page"
};
var STATIC_TRANSITIONING_ATTRIBUTES = { "data-transitioning": "transitioning" };
/** Call a JSX.EventHandlerUnion with the event. */
function callHandler(event, handler) {
	if (typeof handler === "function") handler(event);
	else handler[0](handler[1], event);
	return event.defaultPrevented;
}
function createComposedHandler(getHandler, fallback) {
	return (event) => {
		const handler = getHandler();
		if (!handler || !callHandler(event, handler)) fallback(event);
	};
}
var Link = (props) => {
	const [local, rest] = splitProps(props, ["_asChild", "children"]);
	const [_, linkProps] = splitProps(useLinkProps(rest), ["type"]);
	const children = createMemo(() => {
		const ch = local.children;
		if (typeof ch === "function") return ch({
			get isActive() {
				return linkProps["data-status"] === "active";
			},
			get isTransitioning() {
				return linkProps["data-transitioning"] === "transitioning";
			}
		});
		return ch;
	});
	if (local._asChild === "svg") {
		const [_, svgLinkProps] = splitProps(linkProps, ["class"]);
		return ssr(_tmpl$, ssrHydrationKey(), ssrElement("a", svgLinkProps, () => escape(children()), false));
	}
	if (!local._asChild) return ssrElement("a", linkProps, () => escape(children()), true);
	return createComponent(Dynamic, mergeProps({ get component() {
		return local._asChild;
	} }, linkProps, { get children() {
		return children();
	} }));
};
function isCtrlEvent(e) {
	return !!(e.metaKey || e.altKey || e.ctrlKey || e.shiftKey);
}
function isSafeInternal(to) {
	if (typeof to !== "string") return false;
	const zero = to.charCodeAt(0);
	if (zero === 47) return to.charCodeAt(1) !== 47;
	return zero === 46;
}
//#endregion
export { Link as t };
