import { SetupModel } from './models/SetupModel';
import { HistoryRouter } from './history/modes/History.js';
import { HashRouter } from './history/modes/Hash.js';
import { Events, RouterEventFn } from './models/RouterEvent';
export declare class Router {
    private element;
    private routes;
    private mode;
    static router: HistoryRouter | HashRouter;
    private events;
    constructor(setup: SetupModel);
    private loadRouter;
    private config;
    private defineLinks;
    push(route: string): void;
    go(number: number): void;
    setListener(event: Events, listener: RouterEventFn): void;
}
