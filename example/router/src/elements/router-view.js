const template = document.createElement('template')
template.innerHTML = `
`
export class RouterView extends HTMLElement {
    shadowRoot
    constructor() {
        super()
        this.shadowRoot = this.attachShadow({mode: 'open'})
        this.shadowRoot.appendChild(template.content.cloneNode(true))
    }
}
