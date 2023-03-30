const styles = `
    .header {
        position: sticky;
        top: 0;
        left: 0;
        z-index: 100;
        width: 100%;
        height: auto;
        margin: 0 auto;
        background-color: var(--white-100);
        box-shadow: var(--shadow-medium);
    }
`
export default class Header extends HTMLElement {
    constructor() {
        super()
        this.attachShadow({ mode: 'open' })
        this.createStyles()
        this.createContent()
    }

    private createContent() {
        const content = document.createElement('header')
        content.classList.add('header')
        content.innerHTML = `<slot></slot>`
        this.shadowRoot!.appendChild(content)
    }

    private createStyles() {
        const styleEL = document.createElement('style')
        styleEL.innerHTML = styles
        this.shadowRoot!.append(styleEL)
    }
}

customElements.define('c-header', Header)
