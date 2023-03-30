import { Param } from './Param.js';
import { Route } from './Route.js';
import { RouterEventFn } from './RouterEvent.js';
export type RouteModel = Route & {
    view?: string;
    beforeEnter?: RouterEventFn;
    params?: Param;
    queries?: Param;
};
