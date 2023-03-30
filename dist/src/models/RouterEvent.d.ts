import { Route } from './Route';
import { RouteModel } from './RouteModel';
export type Events = 'beforeEach' | 'change' | 'onload';
export type RouterEventFn = (from: Route, to: Route, next: (to?: string) => void) => void;
export interface RouterEvent {
    beforeEach?: RouterEventFn;
    change?: (route: RouteModel) => void;
    onload?: (route: RouteModel) => void;
}
