import { PageElement } from 'web-component-router'
export default class Panel extends HTMLElement implements PageElement {
    constructor() {
        super()
        this.attachShadow({ mode: 'open' })
        this.shadowRoot!.innerHTML = `
                <h1 style="text-align: center">Panel page created for testing router guard</h1>
            `
    }
}
