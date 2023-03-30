import { RouterView } from '../elements/RouterView'
import { Route } from './Route'
import { RouterEvent } from './RouterEvent'

export type BaseRouterConfig = {
    routes: Route[]
    element: RouterView
    events: RouterEvent
}
