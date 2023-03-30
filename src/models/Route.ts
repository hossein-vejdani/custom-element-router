import { PageElement } from './Page'

type Module = () => Promise<any>
type Component = new () => PageElement
export type Route = {
    name: string
    path: string
    redirect?: string
    page: Module | Component
    children?: Route[]
}
