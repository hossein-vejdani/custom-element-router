import Base from '../Base.js';
export class HistoryRouter extends Base {
    constructor({ routes, element, events }) {
        super({ routes, element, events });
        this.setup();
    }
    setup() {
        const handleRoutes = () => {
            this.loadPage(window.location.pathname);
        };
        window.history.pushState = new Proxy(window.history.pushState, {
            apply: (target, thisArg, argArray) => {
                setTimeout(() => {
                    handleRoutes();
                }, 0);
                return target.apply(thisArg, argArray);
            }
        });
        handleRoutes();
        // const currentRoute = this.getHash()
        // this.loadPage(currentRoute)
    }
    push(route) {
        window.history.pushState('', '', route);
    }
}
