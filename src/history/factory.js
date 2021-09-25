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
                this.#router = new HashRouter(config)
                break
            default:
                throw new Error('Invalid mode')
        }
    }
    getRouter() {
        return this.#router
    }
}
