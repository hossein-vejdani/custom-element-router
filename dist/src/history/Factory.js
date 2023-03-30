var _ModeFactory_router;
import { __classPrivateFieldGet, __classPrivateFieldSet } from "tslib";
import { HashRouter } from './modes/Hash';
import { HistoryRouter } from './modes/History';
export default class ModeFactory {
    constructor(mode, config) {
        _ModeFactory_router.set(this, void 0);
        switch (mode) {
            case 'history':
                __classPrivateFieldSet(this, _ModeFactory_router, new HistoryRouter(config), "f");
                break;
            case 'hash':
                __classPrivateFieldSet(this, _ModeFactory_router, new HashRouter(config), "f");
                break;
            default:
                throw new Error('Invalid mode');
        }
    }
    getRouter() {
        return __classPrivateFieldGet(this, _ModeFactory_router, "f");
    }
}
_ModeFactory_router = new WeakMap();
