class Base {
    #routes
    #currentRoute = {}
    #pageName
    #requestedRoute
    #events
    #lastBeforeEnter
    static params
    constructor({ routes, events }) {
        this.#routes = routes
        this.#events = events
    }

    go(number) {
        window.history.go(number)
        setTimeout(() => {
            this.loadPage(window.location.pathname) 
        }, 0)
    }

     loadPage(page) {
        const originalPageName = page
        if (this.#pageName === page) {
            return
        }
        let route
        if (!page.startsWith('/'))
            page = `/${page}`
        route = this.#getRoute(page)

        if (!route) {
            throw new Error('route not found')
        }

        if (this.#events.beforeEach && this.#requestedRoute?.name !== route.name) {
            this.#requestedRoute = route
            this.#events.beforeEach(this.#currentRoute, route, value => {
                this.push(value ?? page)
            })

            return
        }

        if (route.beforeEnter) {
            this.#currentRoute = route
            this.#requestedRoute = route
            if (this.#lastBeforeEnter !== page) {
                route.beforeEnter(this.#currentRoute, route, value => {
                    this.push(value ?? page)
                    if (!value)
                        this.#lastBeforeEnter = page
                })
                return
            }

        }

        if (route.redirect) {
            this.push(route.redirect)
            return
        }

        this.#currentRoute = route

        this.#pageName = originalPageName ?? undefined

        if (this.#events.change) {
            this.#events.change(route)
        }
        this.#requestedRoute = undefined

        this.#renderTemplate(route, [])
        
    }


    async #renderTemplate(route, lastRoutes = []) {
        await this.#getTemplate(route)
        lastRoutes.push(route)
        if (route.view) {
            const parentRoute = this.#routes.find(i => i.name === route.view)
            this.#renderTemplate(parentRoute, lastRoutes)
            return
        }
        lastRoutes.reverse()
        let el = document.querySelector('router-view')
        if (el) {
            this.#appendElement(lastRoutes, 0, el)
        }
        setTimeout(() => {
            if (this.#events.onload) {
                this.#events.onload(lastRoutes[lastRoutes.length - 1])
            }
        })
    }

    #appendElement(lastRoutes, index, el) {
        if (index === lastRoutes.length) {
            if(el){
                el.shadowRoot.innerHTML = ''
            }
            return
        }
        const i = lastRoutes[index]
        setTimeout(() => {
            if(!el.shadowRoot.querySelector(`route-${i.name}`))
                el.shadowRoot.innerHTML = `<route-${i.name}></route-${i.name}>`
            
            try {
                const page = el.shadowRoot.querySelector(`route-${i.name}`)
                setTimeout(() => {
                    this.#appendElement(lastRoutes, index + 1, page.shadowRoot.querySelector('router-view'))
                }, 0)
            }
            catch (err) {
            }
        }, 0)

    }

    async #getTemplate(route) {
        return new Promise(async (resolve, reject) => {
            let element
            try {
                if (route.page()) {
                    element = (await route.page()).default
                }
            } catch (err) {
                element = route.page
            }
            await this.#defindComponent({ element, route })
            this.params = route.params

            resolve()
        })
    }

    #defindComponent(component) {

        return new Promise((resolve, reject) => {
            try {
                customElements.define('route-' + component.route.name, component.element)
            } finally {
                resolve()
            }

        })
    }

    #getRoute(url) {

        let data = {}
        if (!url || url === '/') {
            const route = this.#routes.find(i => i.path === url)
            route.params = data
            return route
        }

        let defaultRoute
        const urlWithQuery = url
        url = url.split('?')[0]
        let route = this.#routes.find(i => {
            if (i.path === '/')
                return
            else if(i.path === '*') {
                defaultRoute = i
                return
            }
            const regex = new RegExp(i.path.split('?')[0].replace(/:[^\s/]+/g, '([\\w-]+)'))
            const result = url.match(regex)
            if (result && result[0] === result.input) {
                const paramsName = i.path.split('/').filter(i => i.startsWith(':'))
                paramsName.forEach((p, index) => {
                    data[p.replace(':', '')] = result[index + 1]
                })
                return true
            }
        })

        if(!route && defaultRoute) {
            route = defaultRoute
        }
        route ??= defaultRoute
        if(!route) {
            return
        }
        route.params = data
        route.queries = this.#queryParser(urlWithQuery)
        return route
    }

    #queryParser(url) {
        const queryPart = url.split('?')
        if(!queryPart || queryPart.length < 2)
            return []
        const queries = queryPart[1].split('&')
        const data =  {}
        queries.forEach(i => {
            const q = i.split('=')
            data[q[0]] = q[1]
        })
        return data
    }
}

export default Base