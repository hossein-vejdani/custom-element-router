import { RouterView } from '../elements/RouterView'
import { BaseRouterConfig } from '../models/BaseRouterConfig'
import { PageElement } from '../models/Page'
import { Param } from '../models/Param'
import { RouteModel } from '../models/RouteModel'
import { Match, MatchResult } from '../models/RouteParser'

import { RouterEvent } from '../models/RouterEvent'
import { RouteParser } from '../utils/RouteParser'

class Base {
    private routes: RouteModel[]
    private currentRoute!: RouteModel
    private pageName!: string
    private events: RouterEvent
    private lastUrl?: string
    private lastBeforeEnter?: string

    private routeParser = new RouteParser()
    constructor({ routes, events }: BaseRouterConfig) {
        this.routes = routes
        this.events = events
    }

    go(number: number) {
        window.history.go(number)
    }

    async loadPage(page: string) {
        console.log(page)

        const originalPageName = page
        if (this.pageName === page) {
            return
        }

        let route
        if (!page.startsWith('/')) page = `/${page}`
        route = this.getRoute(page)

        do {
            if (this.events.beforeEach && this.lastUrl !== page) {
                try {
                    await this.handleRouterGuard(route, page)
                } catch (err) {
                    break
                }
            }

            if (route.beforeEnter) {
                this.currentRoute = route
                if (this.lastBeforeEnter !== page) {
                    route.beforeEnter(this.currentRoute, route, value => {
                        this.push(value ?? page)
                        if (!value) this.lastBeforeEnter = page
                    })
                    return
                }
            }

            if (route.redirect) {
                this.push(route.redirect)
                return
            }

            this.currentRoute = route

            this.pageName = originalPageName ?? undefined

            if (this.events.change) {
                this.events.change(route)
            }

            this.renderTemplate(route, [])
            this.lastUrl = page
        } while (false)
    }

    private handleRouterGuard(route: RouteModel, page: string): Promise<string> {
        return new Promise((resolve, reject) => {
            if (this.events.beforeEach) {
                this.events.beforeEach(this.currentRoute, route, value => {
                    if (value && value !== page) {
                        this.push(value)
                        return reject()
                    }
                    resolve(value ?? page)
                })
            } else {
                resolve(page)
            }
        })
    }

    private async renderTemplate(route: RouteModel, lastRoutes: RouteModel[] = []) {
        await this.getTemplate(route)

        lastRoutes.push(route)

        if (route.view) {
            const parentRoute = this.routes.find(i => i.name === route.view)!
            this.renderTemplate(parentRoute, lastRoutes)
            return
        }

        lastRoutes.reverse()

        let el = document.querySelector('router-view') as PageElement
        if (el) {
            this.appendElement(lastRoutes, 0, el)
        }

        setTimeout(() => {
            if (this.events.onload) {
                this.events.onload(route)
            }
        }, 0)
    }

    private appendElement(lastRoutes: RouteModel[], index: number, el: PageElement) {
        if (index === lastRoutes.length) {
            if (el) {
                el.shadowRoot!.innerHTML = ''
            }
            return
        }
        const route = lastRoutes[index]
        const elName = `route-${route.name}`
        console.log(el)

        setTimeout(() => {
            try {
                let routeEl = el.shadowRoot!.querySelector(elName)!
                if (!el.shadowRoot!.querySelector(elName)) {
                    routeEl = document.createElement(elName)
                    el.shadowRoot!.innerHTML = ``
                    el.shadowRoot!.append(routeEl)
                }

                routeEl.setAttribute('params', JSON.stringify(route.params))
                routeEl.setAttribute('query-params', JSON.stringify(route.queries))

                const page = el.shadowRoot!.querySelector(`route-${route.name}`)
                setTimeout(() => {
                    this.appendElement(lastRoutes, index + 1, page?.shadowRoot?.querySelector('router-view') as PageElement)
                }, 0)
            } catch (err) {
                throw new Error('router-view element not found')
            }
        }, 0)
    }

    private async getTemplate(route: RouteModel) {
        return new Promise(async resolve => {
            let element: any
            try {
                if (typeof route.page === 'function') {
                    const res = await (route.page as any)()
                    if (!res.default) throw new Error('Not export default found in this file')
                    element = res.default
                } else element = route.page
            } catch (err) {
                element = route.page
            }
            await this.defineComponent({ element, route })

            resolve(null)
        })
    }

    private defineComponent(component: { element: PageElement; route: RouteModel }): Promise<string> {
        return new Promise((resolve, reject) => {
            const name = 'route-' + component.route.name
            try {
                customElements.define(name, component.element as unknown as CustomElementConstructor)
            } finally {
                resolve(name)
            }
        })
    }

    private getRoute(url: string): RouteModel {
        url = decodeURI(url)

        let data: Param = {}
        if (!url) {
            const route = this.routes.find(i => i.path === url)!
            route.params = data
            return route
        }
        let result!: Match
        let route = this.routes.find(i => {
            if (i.path === '/*') return
            const regexFn = this.routeParser.match(i.path)!
            result = regexFn(url)

            return result
        })

        if (!route) {
            route = this.routes.find(i => i.path === '/*')
            if (!route) throw new Error('route not match')
        }
        if (result) {
            route.params = result.params
            route.queries = result.queryParams
        }

        return route
    }

    push(route: string) {
        window.location.hash = route
    }
}

export default Base
