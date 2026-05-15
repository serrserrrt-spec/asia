const routes = new Map();
let mountRoot = null;

export function addRoute(name, renderer) {
  routes.set(name, renderer);
}

export function navigate(path) {
  location.hash = path;
}

export function currentRoute() {
  const hash = location.hash.replace("#", "") || "/";
  const [path, query = ""] = hash.split("?");
  return { path, params: Object.fromEntries(new URLSearchParams(query)) };
}

export function startRouter(root) {
  mountRoot = root;
  window.addEventListener("hashchange", renderCurrent);
  renderCurrent();
}

export function renderCurrent() {
  if (!mountRoot) return;
  const { path, params } = currentRoute();
  const renderer = routes.get(path) || routes.get("/");
  mountRoot.innerHTML = renderer(params);
  mountRoot.dispatchEvent(new CustomEvent("screen:rendered", { bubbles: true }));
}
