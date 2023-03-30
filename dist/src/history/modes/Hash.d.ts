import { BaseRouterConfig } from '../../models/BaseRouterConfig';
import Base from '../Base';
export declare class HashRouter extends Base {
    constructor({ routes, element, events }: BaseRouterConfig);
    private setup;
    push(route: string): void;
    getHash(): string;
}
