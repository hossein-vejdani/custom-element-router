import { BaseRouterConfig } from '../models/BaseRouterConfig';
declare class Base {
    private routes;
    private currentRoute;
    private pageName;
    private events;
    private lastUrl?;
    private lastBeforeEnter?;
    private routeParser;
    constructor({ routes, events }: BaseRouterConfig);
    go(number: number): void;
    loadPage(page: string): Promise<void>;
    private handleRouterGuard;
    private renderTemplate;
    private appendElement;
    private getTemplate;
    private defineComponent;
    private getRoute;
    push(route: string): void;
}
export default Base;
