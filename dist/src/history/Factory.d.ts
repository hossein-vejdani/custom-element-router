import { BaseRouterConfig } from '../models/BaseRouterConfig.js';
import { HashRouter } from './modes/Hash';
import { HistoryRouter } from './modes/History';
export default class ModeFactory {
    #private;
    constructor(mode: 'hash' | 'history', config: BaseRouterConfig);
    getRouter(): HashRouter | HistoryRouter;
}
