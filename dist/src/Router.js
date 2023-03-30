import ModeFactory from './history/Factory';
import { RouterHashLink, RouterHistoryLink } from './elements/RouterLink';
import { RouterView } from './elements/RouterView';
customElements.define('router-view', RouterView);
export class Router {
    constructor(setup) {
        this.routes = [];
        this.events = {};
        this.routes = setup.routes;
        this.mode = setup.mode;
        this.loadRouter();
    }
    loadRouter() {
        setTimeout(() => {
            for (let i of this.routes) {
                if (i.children) {
                    i.children.forEach((route) => {
                        if (!route.path.startsWith('/'))
                            route.path = `${i.path}/${route.path}`;
                        route.view = i.name;
                        this.routes.push(route);
                    });
                    delete i.children;
                }
            }
            const element = document.querySelector(`router-view`);
            if (!element)
                throw new Error('element not found');
            this.element = element;
            this.config();
        }, 0);
    }
    config() {
        const modeFactory = new ModeFactory(this.mode, { routes: this.routes, element: this.element, events: this.events });
        Router.router = modeFactory.getRouter();
        this.defineLinks();
    }
    defineLinks() {
        if (this.mode === 'hash') {
            customElements.define('router-link', RouterHashLink);
        }
        else if (this.mode === 'history') {
            customElements.define('router-link', RouterHistoryLink);
        }
        else {
            throw new Error('invalid router mode');
        }
    }
    push(route) {
        Router.router.push(route);
    }
    go(number) {
        Router.router.go(number);
    }
    setListener(event, listener) {
        console.log(event, listener);
        const validEvents = ['onload', 'change', 'beforeEach'];
        if (validEvents.includes(event))
            this.events[event] = listener;
        else
            throw new Error('invalid event');
    }
}
