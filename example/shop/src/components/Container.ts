const styles = `
    .container {
        max-width: 75rem;
        height: auto;
        margin: 0 auto;
        padding: 0 1.25rem;
    }
`
export default class Container extends HTMLElement {
    constructor() {
        super()
        this.attachShadow({ mode: 'open' })
        this.createStyles()
        this.createContent()
    }

    private createContent() {
        const content = document.createElement('div')
        content.classList.add('container')
        const slot = document.createElement('slot')
        content.append(slot)
        this.shadowRoot!.appendChild(content)
    }

    private createStyles() {
        const styleEL = document.createElement('style')
        styleEL.innerHTML = styles
        this.shadowRoot!.append(styleEL)
    }
}

customElements.define('c-container', Container)
