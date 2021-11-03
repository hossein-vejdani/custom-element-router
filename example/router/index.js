import ModeFactory from './src/history/factory.js'

import { RouterHashLink, RouterHistoryLink } from './src/elements/router-link.js'
import { RouterView } from './src/elements/router-view.js'
customElements.define('router-view', RouterView)

class Router {
    #routes = []
    #events = {}
    #mode
    static router
    constructor(setup) {
        this.#routes = setup.routes
        this.#mode = setup.mode
        this.#loadRouter()
    }

    #loadRouter() {
        setTimeout(() => {
            for(let i of this.#routes) {
                if(i.children) {
                    i.children.forEach(route => {
                        if(!route.path.startsWith('/'))
                            route.path = `${i.path}/${route.path}`
                        route.view = i.name
                        this.#routes.push(route)
                    })
                    delete i.children
                }
            }
            const element = document.querySelector(`router-view`)
            if (!element) throw new Error('element not found')
            this.#config()
        }, 0)
    }

    #config() {
        const modeFactory = new ModeFactory(this.#mode, {routes: this.#routes, events: this.#events})
        this.router = modeFactory.getRouter()
        this.#defineLinks()       
    }

    #defineLinks() {
        if (!this.#mode || this.#mode === 'hash') {
            customElements.define('router-link', RouterHashLink)
        } else if (this.#mode === 'history') {
            customElements.define('router-link', RouterHistoryLink)
        } else {
            throw new Error('invalid router mode')
        }
    }

    push(route) {
        this.router.push(route)
    }

    go(number) {
        this.router.go(number)
    }

    setRouteListener(event, listener) {
        const validEvents = ['onload', 'change', 'beforeEach']
        if(validEvents.includes(event)) 
            this.#events[event] = listener
        else 
            throw new Error('invalid event')
    }

    
    get params() {
        return this.router.params
    }
}

export default Router
