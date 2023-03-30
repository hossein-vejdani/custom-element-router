import { __awaiter } from "tslib";
import { RouteParser } from '../utils/RouteParser';
class Base {
    constructor({ routes, events }) {
        this.routeParser = new RouteParser();
        this.routes = routes;
        this.events = events;
    }
    go(number) {
        window.history.go(number);
    }
    loadPage(page) {
        return __awaiter(this, void 0, void 0, function* () {
            const originalPageName = page;
            if (this.pageName === page) {
                return;
            }
            let route;
            if (!page.startsWith('/'))
                page = `/${page}`;
            route = this.getRoute(page);
            do {
                if (this.events.beforeEach && this.lastUrl !== page) {
                    try {
                        yield this.handleRouterGuard(route, page);
                    }
                    catch (err) {
                        break;
                    }
                }
                if (route.beforeEnter) {
                    this.currentRoute = route;
                    if (this.lastBeforeEnter !== page) {
                        route.beforeEnter(this.currentRoute, route, value => {
                            this.push(value !== null && value !== void 0 ? value : page);
                            if (!value)
                                this.lastBeforeEnter = page;
                        });
                        return;
                    }
                }
                if (route.redirect) {
                    this.push(route.redirect);
                    return;
                }
                this.currentRoute = route;
                this.pageName = originalPageName !== null && originalPageName !== void 0 ? originalPageName : undefined;
                if (this.events.change) {
                    this.events.change(route);
                }
                this.renderTemplate(route, []);
                this.lastUrl = page;
            } while (false);
        });
    }
    handleRouterGuard(route, page) {
        return new Promise((resolve, reject) => {
            if (this.events.beforeEach) {
                this.events.beforeEach(this.currentRoute, route, value => {
                    if (value && value !== page) {
                        this.push(value);
                        return reject();
                    }
                    resolve(value !== null && value !== void 0 ? value : page);
                });
            }
            else {
                resolve(page);
            }
        });
    }
    renderTemplate(route, lastRoutes = []) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.getTemplate(route);
            lastRoutes.push(route);
            if (route.view) {
                const parentRoute = this.routes.find(i => i.name === route.view);
                this.renderTemplate(parentRoute, lastRoutes);
                return;
            }
            lastRoutes.reverse();
            let el = document.querySelector('router-view');
            if (el) {
                this.appendElement(lastRoutes, 0, el);
            }
            setTimeout(() => {
                if (this.events.onload) {
                    this.events.onload(route);
                }
            }, 0);
        });
    }
    appendElement(lastRoutes, index, el) {
        if (index === lastRoutes.length) {
            if (el) {
                el.shadowRoot.innerHTML = '';
            }
            return;
        }
        const route = lastRoutes[index];
        const elName = `route-${route.name}`;
        setTimeout(() => {
            try {
                let routeEl = el.shadowRoot.querySelector(elName);
                if (!el.shadowRoot.querySelector(elName)) {
                    routeEl = document.createElement(elName);
                    el.shadowRoot.innerHTML = ``;
                    el.shadowRoot.append(routeEl);
                }
                routeEl.setAttribute('params', JSON.stringify(route.params));
                routeEl.setAttribute('query-params', JSON.stringify(route.queries));
                const page = el.shadowRoot.querySelector(`route-${route.name}`);
                setTimeout(() => {
                    var _a;
                    this.appendElement(lastRoutes, index + 1, (_a = page === null || page === void 0 ? void 0 : page.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector('router-view'));
                }, 0);
            }
            catch (err) {
                throw new Error('router-view element not found');
            }
        }, 0);
    }
    getTemplate(route) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                let element;
                try {
                    if (typeof route.page === 'function') {
                        const res = yield route.page();
                        if (!res.default)
                            throw new Error('Not export default found in this file');
                        element = res.default;
                    }
                    else
                        element = route.page;
                }
                catch (err) {
                    element = route.page;
                }
                yield this.defineComponent({ element, route });
                resolve(null);
            }));
        });
    }
    defineComponent(component) {
        return new Promise((resolve, reject) => {
            const name = 'route-' + component.route.name;
            try {
                customElements.define(name, component.element);
            }
            finally {
                resolve(name);
            }
        });
    }
    getRoute(url) {
        url = decodeURI(url);
        let data = {};
        if (!url) {
            const route = this.routes.find(i => i.path === url);
            route.params = data;
            return route;
        }
        let result;
        let route = this.routes.find(i => {
            if (i.path === '/*')
                return;
            const regexFn = this.routeParser.match(i.path);
            result = regexFn(url);
            return result;
        });
        if (!route) {
            route = this.routes.find(i => i.path === '/*');
            if (!route)
                throw new Error('route not match');
        }
        if (result) {
            route.params = result.params;
            route.queries = result.queryParams;
        }
        return route;
    }
    push(route) {
        window.location.hash = route;
    }
}
export default Base;
