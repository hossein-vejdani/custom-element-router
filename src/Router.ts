import ModeFactory from './history/Factory'
import { RouterHashLink, RouterHistoryLink } from './elements/RouterLink'
import { RouterView } from './elements/RouterView'
import { Route } from './models/Route'
import { SetupModel } from './models/SetupModel'
import { HistoryRouter } from './history/modes/History.js'
import { HashRouter } from './history/modes/Hash.js'
import { RouteModel } from './models/RouteModel'
import { Events, RouterEvent, RouterEventFn } from './models/RouterEvent'
customElements.define('router-view', RouterView)

export class Router {
    private element!: RouterView
    private routes: Route[] = []
    private mode: 'hash' | 'history'
    static router: HistoryRouter | HashRouter
    private events: RouterEvent = {}
    constructor(setup: SetupModel) {
        this.routes = setup.routes
        this.mode = setup.mode
        this.loadRouter()
    }

    private loadRouter() {
        setTimeout(() => {
            for (let i of this.routes) {
                if (i.children) {
                    i.children.forEach((route: RouteModel) => {
                        if (!route.path.startsWith('/')) route.path = `${i.path}/${route.path}`
                        route.view = i.name
                        this.routes.push(route)
                    })
                    delete (i as any).children
                }
            }
            const element = document.querySelector(`router-view`) as RouterView
            if (!element) throw new Error('element not found')
            this.element = element
            this.config()
        }, 0)
    }

    private config() {
        const modeFactory = new ModeFactory(this.mode, { routes: this.routes, element: this.element, events: this.events })
        Router.router = modeFactory.getRouter()
        this.defineLinks()
    }

    private defineLinks() {
        if (this.mode === 'hash') {
            customElements.define('router-link', RouterHashLink)
        } else if (this.mode === 'history') {
            customElements.define('router-link', RouterHistoryLink)
        } else {
            throw new Error('invalid router mode')
        }
    }

    push(route: string) {
        Router.router.push(route)
    }

    go(number: number) {
        Router.router.go(number)
    }

    setListener(event: Events, listener: RouterEventFn) {
        const validEvents = ['onload', 'change', 'beforeEach']
        if (validEvents.includes(event)) (this.events as any)[event] = listener
        else throw new Error('invalid event')
    }
}
