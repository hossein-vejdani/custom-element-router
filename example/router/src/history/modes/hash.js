import Base from '../base.js'
class HashHistory extends Base {
    constructor({ base, routes, element, events }) {
        super({ base, routes, element, events })
        this.#setup()
    }

    #setup() {
        
        window.addEventListener('popstate', ev => {
            this.#handleRoutes(ev)
        })
        const currentRoute = this.#getHash()
        this.loadPage(currentRoute)
    }
    
    #handleRoutes(ev) {
        if(ev)
           ev.preventDefault()
        const page = this.#getHash()
        setTimeout(() => { 
            this.loadPage(page)
        }, 0)
    }

    push(route) {
        if(window.location.hash.replace('#', '') !== route)
            window.location.hash = route
        else {
            this.#handleRoutes()
        }
    }

    #getHash() {
        const url = window.location.href
        const hashIndex = url.indexOf('#')
        if(hashIndex === -1) 
            return ''
        return url.slice(hashIndex + 1)
    }
}

export default HashHistory
