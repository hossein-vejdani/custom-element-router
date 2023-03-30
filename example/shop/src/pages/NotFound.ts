import { PageElement } from 'web-component-router'
export default class NotFound extends HTMLElement implements PageElement {
    constructor() {
        super()
        this.attachShadow({ mode: 'open' })
        this.shadowRoot!.innerHTML = `
                <h1 style="text-align: center">404 page Not found</h1>
            `
    }
}
