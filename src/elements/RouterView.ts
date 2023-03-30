import { PageElement } from '../models/Page'

export class RouterView extends HTMLElement implements PageElement {
    constructor() {
        super()
        this.attachShadow({ mode: 'open' })
    }
}
