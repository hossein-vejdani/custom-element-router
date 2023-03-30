import { BaseRouterConfig } from '../models/BaseRouterConfig.js'
import { HashRouter } from './modes/Hash'
import { HistoryRouter } from './modes/History'
export default class ModeFactory {
    #router
    constructor(mode: 'hash' | 'history', config: BaseRouterConfig) {
        switch (mode) {
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
    getRouter(): HashRouter | HistoryRouter {
        return this.#router
    }
}
