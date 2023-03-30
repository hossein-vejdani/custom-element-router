import { BaseRouterConfig } from '../../models/BaseRouterConfig'
import Base from '../Base'
export class HashRouter extends Base {
    constructor({ routes, element, events }: BaseRouterConfig) {
        super({ routes, element, events })
        this.setup()
    }

    private setup() {
        const handleRoutes = (ev: any) => {
            ev.preventDefault()
            const page = this.getHash()
            this.loadPage(page)
        }
        window.addEventListener('popstate', handleRoutes)

        const currentRoute = this.getHash()
        this.loadPage(currentRoute)
    }

    push(route: string) {
        window.location.hash = route
    }

    getHash() {
        const url = window.location.href
        const hashIndex = url.indexOf('#')
        if (hashIndex === -1) return ''
        return url.slice(hashIndex + 1)
    }
}
