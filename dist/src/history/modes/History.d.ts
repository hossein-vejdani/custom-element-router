import { BaseRouterConfig } from '../../models/BaseRouterConfig.js';
import Base from '../Base.js';
export declare class HistoryRouter extends Base {
    constructor({ routes, element, events }: BaseRouterConfig);
    private setup;
    push(route: string): void;
}
