import Base from '../base.js'
class HashHistory extends Base {
    constructor({ base, routes, element, events }) {
        super({ base, routes, element, events })
        this.#setup()
    }

    #setup() {
        const handleRoutes = ev => {
            ev.preventDefault()
            const page = this.getHash()
            this.loadPage(page)
        }
        window.addEventListener('popstate', handleRoutes)
 
        const currentRoute = this.getHash()
        this.loadPage(currentRoute)
    }
    
    push(route) {
        window.location.hash = route
    }

    getHash() {
        const url = window.location.href
        const hashIndex = url.indexOf('#')
        if(hashIndex === -1) 
            return ''
        return url.slice(hashIndex + 1)
    }
}

export default HashHistory
