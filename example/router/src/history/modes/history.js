import Base from '../base.js'
class HashHistory extends Base {
    constructor({ base, routes, element, events }) {
        super({ base, routes, element, events })
        this.#setup()
    }

    #setup() {
        const handleRoutes = () => {
            this.loadPage(window.location.href.replace(window.location.origin, ''))
        }
        window.history.pushState = new Proxy(window.history.pushState, {
            apply: (target, thisArg, argArray) => {
                setTimeout(() => {
                    handleRoutes()
                }, 0)
                return target.apply(thisArg, argArray)
            }
        })
       
        handleRoutes()
 
        // const currentRoute = this.getHash()
        // this.loadPage(currentRoute)
    }
    
    push(route) {
        window.history.pushState('', null, route)
    }

}

export default HashHistory
