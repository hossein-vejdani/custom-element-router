import { Route } from './Route'

export interface SetupModel {
    mode: 'hash' | 'history'
    routes: Route[]
}
