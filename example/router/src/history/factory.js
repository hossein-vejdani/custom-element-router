import HashRouter from './modes/hash.js'
import HistoryRouter from './modes/history.js'
export default class ModeFactory {
    #router
    constructor(mode, config) {
        switch(mode) {
            case 'history': 
                this.#router = new HistoryRouter(config)
                break
            
            case 'hash': 
            default:
                this.#router = new HashRouter(config)
        }
    }
    getRouter() {
        return this.#router
    }
}
