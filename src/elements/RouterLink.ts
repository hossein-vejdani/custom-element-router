const template = document.createElement('template')
template.innerHTML = `
<style>
    a {    
        color: inherit;
        text-decoration: inherit;
    }
</style>
<a><slot></slot></a>
`
class RouterLink extends HTMLElement {
    constructor() {
        super()
        this.attachShadow({ mode: 'open' })
        this.shadowRoot!.appendChild(template.content.cloneNode(true))
    }
}

export class RouterHashLink extends RouterLink {
    constructor() {
        super()
    }
    connectedCallback() {
        const link = this.shadowRoot!.querySelector('a')!
        link.href = '#' + this.getAttribute('to')
    }
}

export class RouterHistoryLink extends RouterLink {
    constructor() {
        super()
    }
    connectedCallback() {
        const link = this.shadowRoot!.querySelector('a')!
        link.href = this.getAttribute('to')!
        link.addEventListener('click', ev => {
            ev.preventDefault()
            window.history.pushState(link.href, '', link.href)
        })
    }
}
