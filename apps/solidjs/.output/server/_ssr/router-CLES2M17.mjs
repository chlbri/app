import { C as For, F as createResource, H as onMount, M as createEffect, N as createMemo, P as createRenderEffect, R as createUniqueId, V as onCleanup, a as escape, c as ssr, d as ssrHydrationKey, i as NoHydration, j as createContext, k as createComponent, n as Dynamic, p as useAssets, q as useContext, r as HydrationScript, u as ssrElement, z as mergeProps } from "../_libs/@solid-primitives/refs+[...].mjs";
import { A as createNonReactiveReadonlyStore, D as RouterCore, H as escapeHtml, K as isModuleNotFoundError, S as getScriptPreloadAttrs, T as resolveManifestCssLink, b as appendUniqueUserTags, k as createNonReactiveMutableStore, q as replaceEqualDeep, v as BaseRootRoute, x as getAssetCrossOrigin, y as BaseRoute, z as invariant } from "../_libs/@tanstack/router-core+[...].mjs";
import { i as useRouter, n as nearestMatchContext, t as Outlet } from "./ssr.mjs";
import { t as Link$1 } from "./link-DmEhZipg.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-CLES2M17.js
function useMatch(opts) {
	const router = useRouter();
	const nearestMatch = opts.from ? void 0 : useContext(nearestMatchContext);
	const match = () => {
		if (opts.from) return router.stores.getRouteMatchStore(opts.from).get();
		return nearestMatch?.match();
	};
	createEffect(() => {
		if (match() !== void 0) return;
		if (!(opts.from ? Boolean(router.stores.pendingRouteIds.get()[opts.from]) : nearestMatch?.hasPending() ?? false) && !router.stores.isTransitioning.get() && (opts.shouldThrow ?? true)) invariant();
	});
	return createMemo((prev) => {
		const selectedMatch = match();
		if (selectedMatch === void 0) {
			const hasPendingMatch = opts.from ? Boolean(router.stores.pendingRouteIds.get()[opts.from]) : nearestMatch?.hasPending() ?? false;
			if (prev !== void 0 && (hasPendingMatch || router.stores.isTransitioning.get())) return prev;
			return;
		}
		const res = opts.select ? opts.select(selectedMatch) : selectedMatch;
		if (prev === void 0) return res;
		return replaceEqualDeep(prev, res);
	});
}
function useLoaderData(opts) {
	return useMatch({
		from: opts.from,
		strict: opts.strict,
		select: (match) => {
			return opts.select ? opts.select(match.loaderData) : match.loaderData;
		}
	});
}
function useLoaderDeps(opts) {
	return useMatch({
		...opts,
		select: (match) => {
			return opts.select ? opts.select(match.loaderDeps) : match.loaderDeps;
		}
	});
}
function useParams(opts) {
	return useMatch({
		from: opts.from,
		strict: opts.strict,
		shouldThrow: opts.shouldThrow,
		select: (match) => {
			const params = opts.strict === false ? match.params : match._strictParams;
			return opts.select ? opts.select(params) : params;
		}
	});
}
function useSearch(opts) {
	return useMatch({
		from: opts.from,
		strict: opts.strict,
		shouldThrow: opts.shouldThrow,
		select: (match) => {
			const search = match.search;
			return opts.select ? opts.select(search) : search;
		}
	});
}
function useNavigate(_defaultOpts) {
	const router = useRouter();
	return (options) => {
		return router.navigate({
			...options,
			from: options.from ?? _defaultOpts?.from
		});
	};
}
function useRouteContext(opts) {
	return useMatch({
		...opts,
		select: (match) => opts.select ? opts.select(match.context) : match.context
	});
}
var Route$4 = class extends BaseRoute {
	/**
	* @deprecated Use the `createRoute` function instead.
	*/
	constructor(options) {
		super(options);
		this.useMatch = (opts) => {
			return useMatch({
				select: opts?.select,
				from: this.id
			});
		};
		this.useRouteContext = (opts) => {
			return useRouteContext({
				...opts,
				from: this.id
			});
		};
		this.useSearch = (opts) => {
			return useSearch({
				select: opts?.select,
				from: this.id
			});
		};
		this.useParams = (opts) => {
			return useParams({
				select: opts?.select,
				from: this.id
			});
		};
		this.useLoaderDeps = (opts) => {
			return useLoaderDeps({
				...opts,
				from: this.id
			});
		};
		this.useLoaderData = (opts) => {
			return useLoaderData({
				...opts,
				from: this.id
			});
		};
		this.useNavigate = () => {
			return useNavigate({ from: this.fullPath });
		};
		this.Link = (props) => {
			const _self$ = this;
			return createComponent(Link$1, mergeProps({ get from() {
				return _self$.fullPath;
			} }, props));
		};
	}
};
function createRoute(options) {
	return new Route$4(options);
}
var RootRoute = class extends BaseRootRoute {
	/**
	* @deprecated `RootRoute` is now an internal implementation detail. Use `createRootRoute()` instead.
	*/
	constructor(options) {
		super(options);
		this.useMatch = (opts) => {
			return useMatch({
				select: opts?.select,
				from: this.id
			});
		};
		this.useRouteContext = (opts) => {
			return useRouteContext({
				...opts,
				from: this.id
			});
		};
		this.useSearch = (opts) => {
			return useSearch({
				select: opts?.select,
				from: this.id
			});
		};
		this.useParams = (opts) => {
			return useParams({
				select: opts?.select,
				from: this.id
			});
		};
		this.useLoaderDeps = (opts) => {
			return useLoaderDeps({
				...opts,
				from: this.id
			});
		};
		this.useLoaderData = (opts) => {
			return useLoaderData({
				...opts,
				from: this.id
			});
		};
		this.useNavigate = () => {
			return useNavigate({ from: this.fullPath });
		};
		this.Link = (props) => {
			const _self$2 = this;
			return createComponent(Link$1, mergeProps({ get from() {
				return _self$2.fullPath;
			} }, props));
		};
	}
};
function createRootRoute(options) {
	return new RootRoute(options);
}
function createFileRoute(path) {
	return new FileRoute(path, { silent: true }).createRoute;
}
/**
@deprecated It's no longer recommended to use the `FileRoute` class directly.
Instead, use `createFileRoute('/path/to/file')(options)` to create a file route.
*/
var FileRoute = class {
	constructor(path, _opts) {
		this.path = path;
		this.createRoute = (options) => {
			const route = createRoute(options);
			route.isRoot = false;
			return route;
		};
		this.silent = _opts?.silent;
	}
};
function lazyRouteComponent(importer, exportName) {
	let loadPromise;
	let comp;
	let error;
	const load = () => {
		if (!loadPromise) loadPromise = importer().then((res) => {
			loadPromise = void 0;
			comp = res[exportName ?? "default"];
			return comp;
		}).catch((err) => {
			error = err;
		});
		return loadPromise;
	};
	const lazyComp = function Lazy(props) {
		if (error) {
			if (isModuleNotFoundError(error)) {
				if (error instanceof Error && typeof window !== "undefined" && typeof sessionStorage !== "undefined") {
					const storageKey = `tanstack_router_reload:${error.message}`;
					if (!sessionStorage.getItem(storageKey)) {
						sessionStorage.setItem(storageKey, "1");
						window.location.reload();
						return { default: () => null };
					}
				}
			}
			throw error;
		}
		if (!comp) {
			const [compResource] = createResource(load, {
				initialValue: comp,
				ssrLoadFrom: "initial"
			});
			return createComponent(Dynamic, mergeProps({ get component() {
				return compResource();
			} }, props));
		}
		return createComponent(Dynamic, mergeProps({ component: comp }, props));
	};
	lazyComp.preload = load;
	return lazyComp;
}
function initRouterStores(stores, createReadonlyStore) {
	stores.childMatchIdByRouteId = createReadonlyStore(() => {
		const ids = stores.matchesId.get();
		const obj = {};
		for (let i = 0; i < ids.length - 1; i++) {
			const parentStore = stores.matchStores.get(ids[i]);
			if (parentStore?.routeId) obj[parentStore.routeId] = ids[i + 1];
		}
		return obj;
	});
	stores.pendingRouteIds = createReadonlyStore(() => {
		const ids = stores.pendingIds.get();
		const obj = {};
		for (const id of ids) {
			const store = stores.pendingMatchStores.get(id);
			if (store?.routeId) obj[store.routeId] = true;
		}
		return obj;
	});
}
if (typeof globalThis !== "undefined" && "FinalizationRegistry" in globalThis) new FinalizationRegistry((cb) => cb());
var getStoreFactory = (opts) => {
	return {
		createMutableStore: createNonReactiveMutableStore,
		createReadonlyStore: createNonReactiveReadonlyStore,
		batch: (fn) => fn(),
		init: (stores) => initRouterStores(stores, createNonReactiveReadonlyStore)
	};
};
var createRouter = (options) => {
	return new Router(options);
};
var Router = class extends RouterCore {
	constructor(options) {
		super(options, getStoreFactory);
	}
};
var MetaContext = createContext();
var cascadingTags = ["title", "meta"];
var titleTagProperties = [];
var metaTagProperties = [
	"name",
	"http-equiv",
	"content",
	"charset",
	"media"
].concat(["property"]);
var getTagKey = (tag, properties) => {
	const tagProps = Object.fromEntries(Object.entries(tag.props).filter(([k]) => properties.includes(k)).sort());
	if (Object.hasOwn(tagProps, "name") || Object.hasOwn(tagProps, "property")) {
		tagProps.name = tagProps.name || tagProps.property;
		delete tagProps.property;
	}
	return tag.tag + JSON.stringify(tagProps);
};
function initServerProvider() {
	const tags = [];
	useAssets(() => ssr(renderTags(tags)));
	return {
		addTag(tagDesc) {
			if (cascadingTags.indexOf(tagDesc.tag) !== -1) {
				const properties = tagDesc.tag === "title" ? titleTagProperties : metaTagProperties;
				const tagDescKey = getTagKey(tagDesc, properties);
				const index = tags.findIndex((prev) => prev.tag === tagDesc.tag && getTagKey(prev, properties) === tagDescKey);
				if (index !== -1) tags.splice(index, 1);
			}
			tags.push(tagDesc);
			return tags.length;
		},
		removeTag(tag, index) {}
	};
}
var MetaProvider = (props) => {
	const actions = initServerProvider();
	return createComponent(MetaContext.Provider, {
		value: actions,
		get children() {
			return props.children;
		}
	});
};
var MetaTag = (tag, props, setting) => {
	useHead({
		tag,
		props,
		setting,
		id: createUniqueId(),
		get name() {
			return props.name || props.property;
		}
	});
	return null;
};
function useHead(tagDesc) {
	const c = useContext(MetaContext);
	if (!c) throw new Error("<MetaProvider /> should be in the tree");
	createRenderEffect(() => {
		const index = c.addTag(tagDesc);
		onCleanup(() => c.removeTag(tagDesc, index));
	});
}
function renderTags(tags) {
	return tags.map((tag) => {
		const props = Object.keys(tag.props).map((k) => k === "children" ? "" : ` ${k}="${escape(tag.props[k], true)}"`).join("");
		let children = tag.props.children;
		if (Array.isArray(children)) children = children.join("");
		if (tag.setting?.close) return `<${tag.tag} data-sm="${tag.id}"${props}>${tag.setting?.escape ? escape(children) : children || ""}</${tag.tag}>`;
		return `<${tag.tag} data-sm="${tag.id}"${props}/>`;
	}).join("");
}
var Title = (props) => MetaTag("title", props, {
	escape: true,
	close: true
});
var Style = (props) => MetaTag("style", props, { close: true });
var Meta = (props) => MetaTag("meta", props);
var Link = (props) => MetaTag("link", props);
function Asset(asset) {
	const { tag, attrs, children } = asset;
	switch (tag) {
		case "title": return createComponent(Title, mergeProps(attrs, { children }));
		case "meta": return createComponent(Meta, attrs);
		case "link": return createComponent(Link, attrs);
		case "style":
			if (asset.inlineCss && false);
			return createComponent(Style, mergeProps(attrs, { children }));
		case "script": return createComponent(Script, {
			attrs,
			children
		});
		default: return null;
	}
}
function Script({ attrs, children }) {
	useRouter();
	const dataScript = typeof attrs?.type === "string" && attrs.type !== "" && attrs.type !== "text/javascript" && attrs.type !== "module";
	onMount(() => {
		if (dataScript) return;
		if (attrs?.src) {
			const normSrc = (() => {
				try {
					const base = document.baseURI || window.location.href;
					return new URL(attrs.src, base).href;
				} catch {
					return attrs.src;
				}
			})();
			if (Array.from(document.querySelectorAll("script[src]")).find((el) => el.src === normSrc)) return;
			const script = document.createElement("script");
			for (const [key, value] of Object.entries(attrs)) if (value !== void 0 && value !== false) script.setAttribute(key, typeof value === "boolean" ? "" : String(value));
			document.head.appendChild(script);
			onCleanup(() => {
				if (script.parentNode) script.parentNode.removeChild(script);
			});
		}
		if (typeof children === "string") {
			const typeAttr = typeof attrs?.type === "string" ? attrs.type : "text/javascript";
			const nonceAttr = typeof attrs?.nonce === "string" ? attrs.nonce : void 0;
			if (Array.from(document.querySelectorAll("script:not([src])")).find((el) => {
				if (!(el instanceof HTMLScriptElement)) return false;
				const sType = el.getAttribute("type") ?? "text/javascript";
				const sNonce = el.getAttribute("nonce") ?? void 0;
				return el.textContent === children && sType === typeAttr && sNonce === nonceAttr;
			})) return;
			const script = document.createElement("script");
			script.textContent = children;
			if (attrs) {
				for (const [key, value] of Object.entries(attrs)) if (value !== void 0 && value !== false) script.setAttribute(key, typeof value === "boolean" ? "" : String(value));
			}
			document.head.appendChild(script);
			onCleanup(() => {
				if (script.parentNode) script.parentNode.removeChild(script);
			});
		}
	});
	if (attrs?.src && typeof attrs.src === "string") return ssrElement("script", attrs, void 0, true);
	if (typeof children === "string") return ssrElement("script", mergeProps(attrs, { innerHTML: children }), void 0, true);
	return null;
}
/**
* Build the list of head/link/meta/script tags to render for active matches.
* Used internally by `HeadContent`.
*/
var useTags = (assetCrossOrigin) => {
	const router = useRouter();
	const nonce = router.options.ssr?.nonce;
	const activeMatches = createMemo(() => router.stores.matches.get());
	const routeMeta = createMemo(() => activeMatches().map((match) => match.meta).filter((meta) => meta !== void 0));
	const meta = createMemo(() => {
		const resultMeta = [];
		const metaByAttribute = {};
		let title;
		const routeMetasArray = routeMeta();
		for (let i = routeMetasArray.length - 1; i >= 0; i--) {
			const metas = routeMetasArray[i];
			for (let j = metas.length - 1; j >= 0; j--) {
				const m = metas[j];
				if (!m) continue;
				if (m.title) {
					if (!title) title = {
						tag: "title",
						children: m.title
					};
				} else if ("script:ld+json" in m) try {
					const json = JSON.stringify(m["script:ld+json"]);
					resultMeta.push({
						tag: "script",
						attrs: { type: "application/ld+json" },
						children: escapeHtml(json)
					});
				} catch {}
				else {
					const attribute = m.name ?? m.property;
					if (attribute) if (metaByAttribute[attribute]) continue;
					else metaByAttribute[attribute] = true;
					resultMeta.push({
						tag: "meta",
						attrs: {
							...m,
							nonce
						}
					});
				}
			}
		}
		if (title) resultMeta.push(title);
		if (router.options.ssr?.nonce) resultMeta.push({
			tag: "meta",
			attrs: {
				property: "csp-nonce",
				content: router.options.ssr.nonce
			}
		});
		resultMeta.reverse();
		return resultMeta;
	});
	const links = createMemo(() => {
		return activeMatches().flatMap((match) => match.links ?? []).filter((link) => link !== void 0).map((link) => ({
			tag: "link",
			attrs: {
				...link,
				nonce
			}
		}));
	});
	const manifestCssTags = createMemo(() => {
		const manifest = router.ssr?.manifest;
		const tags = [];
		if (!manifest) return tags;
		for (const match of activeMatches()) manifest.routes[match.routeId]?.css?.forEach((link) => {
			const resolvedLink = resolveManifestCssLink(link);
			tags.push({
				tag: "link",
				attrs: {
					rel: "stylesheet",
					...resolvedLink,
					crossOrigin: getAssetCrossOrigin(assetCrossOrigin, "stylesheet") ?? resolvedLink.crossOrigin,
					nonce
				}
			});
		});
		if (manifest.inlineStyle) tags.push({
			tag: "style",
			attrs: {
				...manifest.inlineStyle.attrs,
				nonce
			},
			children: manifest.inlineStyle.children,
			inlineCss: true
		});
		return tags;
	});
	const preloadLinks = createMemo(() => {
		const matches = activeMatches();
		const preloadLinks = [];
		matches.forEach((match) => router.ssr?.manifest?.routes[match.routeId]?.preloads?.filter(Boolean).forEach((preload) => {
			preloadLinks.push({
				tag: "link",
				attrs: {
					...getScriptPreloadAttrs(router.ssr?.manifest, preload, assetCrossOrigin),
					nonce
				}
			});
		}));
		return preloadLinks;
	});
	const styles = createMemo(() => {
		return activeMatches().flatMap((match) => match.styles ?? []).filter((style) => style !== void 0).map(({ children, ...style }) => ({
			tag: "style",
			attrs: {
				...style,
				nonce
			},
			children
		}));
	});
	const headScripts = createMemo(() => {
		return activeMatches().flatMap((match) => match.headScripts ?? []).filter((script) => script !== void 0).map(({ children, ...script }) => ({
			tag: "script",
			attrs: {
				...script,
				nonce
			},
			children
		}));
	});
	return createMemo((prev) => {
		const next = [];
		appendUniqueUserTags(next, meta());
		next.push(...preloadLinks());
		appendUniqueUserTags(next, links());
		next.push(...manifestCssTags());
		appendUniqueUserTags(next, styles());
		appendUniqueUserTags(next, headScripts());
		if (prev === void 0) return next;
		return replaceEqualTags(prev, next);
	});
};
function replaceEqualTags(prev, next) {
	const prevByKey = /* @__PURE__ */ new Map();
	for (const tag of prev) prevByKey.set(JSON.stringify(tag), tag);
	let isEqual = prev.length === next.length;
	const result = next.map((tag, index) => {
		const existing = prevByKey.get(JSON.stringify(tag));
		if (existing) {
			if (existing !== prev[index]) isEqual = false;
			return existing;
		}
		isEqual = false;
		return tag;
	});
	return isEqual ? prev : result;
}
/**
* @description The `HeadContent` component is used to render meta tags, links, and scripts for the current route.
* When using full document hydration (hydrating from `<html>`), this component should be rendered in the `<body>`
* to ensure it's part of the reactive tree and updates correctly during client-side navigation.
* The component uses portals internally to render content into the `<head>` element.
*/
function HeadContent(props) {
	const tags = useTags(props.assetCrossOrigin);
	return createComponent(MetaProvider, { get children() {
		return createComponent(For, {
			get each() {
				return tags();
			},
			children: (tag) => createComponent(Asset, tag)
		});
	} });
}
var Scripts = () => {
	const router = useRouter();
	const nonce = router.options.ssr?.nonce;
	const getAssetScripts = (matches) => {
		const assetScripts = [];
		const manifest = router.ssr?.manifest;
		if (!manifest) return [];
		for (const match of matches) {
			const scripts = manifest.routes[match.routeId]?.scripts;
			if (!scripts) continue;
			for (const asset of scripts) assetScripts.push({
				tag: "script",
				attrs: {
					...asset.attrs,
					nonce
				},
				children: asset.children
			});
		}
		return assetScripts;
	};
	const getScripts = (matches) => matches.map((match) => match.scripts).flat(1).filter(Boolean).map(({ children, ...script }) => ({
		tag: "script",
		attrs: {
			...script,
			nonce
		},
		children
	}));
	const activeMatches = createMemo(() => router.stores.matches.get());
	const assetScripts = createMemo(() => getAssetScripts(activeMatches()));
	return renderScripts(router, createMemo(() => getScripts(activeMatches()))(), assetScripts());
};
function renderScripts(router, scripts, assetScripts) {
	const allScripts = [...scripts, ...assetScripts];
	if (router.serverSsr) {
		const serverBufferedScript = router.serverSsr.takeBufferedScripts();
		if (serverBufferedScript) allScripts.unshift(serverBufferedScript);
	}
	return allScripts.map((asset) => createComponent(Asset, asset));
}
var TanStackRouterDevtools = function() {
	return null;
};
var app_default = "/assets/app-DObgDV5X.css";
var _tmpl$$1 = ["<head>", "</head>"];
var _tmpl$2$1 = [
	"<html",
	" lang=\"en\">",
	"<body class=\"bg-slate-950 text-slate-100 min-h-screen font-sans antialiased selection:bg-indigo-500 selection:text-white\"><!--$-->",
	"<!--/--><header class=\"sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md px-6 py-4\"><div class=\"max-w-7xl mx-auto flex items-center justify-between\"><div class=\"flex items-center space-x-3\"><div class=\"h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center font-black text-white text-lg shadow-lg shadow-indigo-500/25\">⚡</div><div><h1 class=\"text-base font-bold bg-gradient-to-r from-indigo-300 via-white to-purple-300 bg-clip-text text-transparent\">@bemedev/app-solidjs</h1><p class=\"text-xs text-slate-400\">TanStack Start Visual Tester</p></div></div><nav class=\"flex items-center space-x-2\"><!--$-->",
	"<!--/--><!--$-->",
	"<!--/--><!--$-->",
	"<!--/--></nav></div></header><main class=\"max-w-7xl mx-auto p-6 md:p-8\">",
	"</main><!--$-->",
	"<!--/--><!--$-->",
	"<!--/--></body></html>"
];
var Route$3 = createRootRoute({
	head: () => ({
		links: [{
			rel: "stylesheet",
			href: app_default
		}],
		meta: [
			{ charset: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "@bemedev/app + @bemedev/app-solidjs Visual Tester" }
		]
	}),
	component: () => {
		return ssr(_tmpl$2$1, ssrHydrationKey(), createComponent(NoHydration, { get children() {
			return ssr(_tmpl$$1, escape(createComponent(HydrationScript, {})));
		} }), escape(createComponent(HeadContent, {})), escape(createComponent(Link$1, {
			to: "/",
			activeProps: { class: "bg-indigo-600/30 text-indigo-300 border-indigo-500/50" },
			inactiveProps: { class: "text-slate-400 hover:text-slate-200 hover:bg-slate-900 border-transparent" },
			"class": "px-3.5 py-1.5 rounded-lg text-sm font-medium border transition-all",
			activeOptions: { exact: true },
			children: "Overview"
		})), escape(createComponent(Link$1, {
			to: "/counter",
			activeProps: { class: "bg-indigo-600/30 text-indigo-300 border-indigo-500/50" },
			inactiveProps: { class: "text-slate-400 hover:text-slate-200 hover:bg-slate-900 border-transparent" },
			"class": "px-3.5 py-1.5 rounded-lg text-sm font-medium border transition-all",
			children: "Counter Machine"
		})), escape(createComponent(Link$1, {
			to: "/traffic",
			activeProps: { class: "bg-indigo-600/30 text-indigo-300 border-indigo-500/50" },
			inactiveProps: { class: "text-slate-400 hover:text-slate-200 hover:bg-slate-900 border-transparent" },
			"class": "px-3.5 py-1.5 rounded-lg text-sm font-medium border transition-all",
			children: "Nested Traffic Machine"
		})), escape(createComponent(Outlet, {})), escape(createComponent(TanStackRouterDevtools, {})), escape(createComponent(Scripts, {})));
	}
});
var $$splitComponentImporter$2 = () => import("./traffic-B8bCkKJy.mjs");
var Route$2 = createFileRoute("/traffic")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./counter-hTrfs_AW.mjs");
var Route$1 = createFileRoute("/counter")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./routes-CAJEah7h.mjs");
var Route = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var TrafficRoute = Route$2.update({
	id: "/traffic",
	path: "/traffic",
	getParentRoute: () => Route$3
});
var CounterRoute = Route$1.update({
	id: "/counter",
	path: "/counter",
	getParentRoute: () => Route$3
});
var rootRouteChildren = {
	IndexRoute: Route.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$3
	}),
	CounterRoute,
	TrafficRoute
};
var routeTree = Route$3._addFileChildren(rootRouteChildren)._addFileTypes();
var _tmpl$ = [
	"<div",
	" class=\"p-6 bg-red-950/80 text-red-200 rounded-xl border border-red-800 font-mono text-sm\"><h3 class=\"font-bold text-lg mb-2\">Router Error</h3><pre class=\"overflow-x-auto whitespace-pre-wrap\">",
	"</pre></div>"
];
var _tmpl$2 = ["<div", " class=\"p-12 text-center text-slate-400\"><h2 class=\"text-2xl font-bold text-slate-200 mb-2\">404 - Not Found</h2><p>The requested route could not be found.</p></div>"];
function getRouter() {
	return createRouter({
		routeTree,
		defaultPreload: "intent",
		defaultErrorComponent: (err) => ssr(_tmpl$, ssrHydrationKey(), escape(err.error.stack ?? String(err.error))),
		defaultNotFoundComponent: () => ssr(_tmpl$2, ssrHydrationKey()),
		scrollRestoration: true
	});
}
//#endregion
export { getRouter };
