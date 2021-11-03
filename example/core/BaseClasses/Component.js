export default class Component extends HTMLElement {
    shadowRoot
    props 
    state = {}
    template  
    events = []  
    isSetStateCalled = false
    static router
    constructor(props) {
        super()
        this.shadowRoot = this.attachShadow({mode: 'open'})
        this.template =  document.createElement('template')
        this.shadowRoot.appendChild(this.template.content.cloneNode(true))
        this.props = props    
        this.renderTemplate()
        this.router = window.router
    }

    setState(name, data) {
        this.state[name] = data
        if(!this.isSetStateCalled) {
            this.isSetStateCalled = true
            setTimeout(() => {
                this.renderTemplate()
                this.isSetStateCalled = false
            }, 0)
        }
    }

    addEvent(target, event, callback) {
        setTimeout(() => {
            const el = this.shadowRoot.querySelector(target)
            if(el) {
                el.addEventListener(event, callback)
                this.events.push({target, event, callback})
            }
        }, 0)
    }

    removeEvent(target, event, callback) {
        const el = this.shadowRoot.querySelector(target)
        if(el) {
            el.removeEventListener(event, callback)
        }
    }

    removeAllEvents() {
        this.events.forEach(ev => {
              this.removeEvent(ev.target, ev.event, ev.callback)
        })
    }

    addEvents() {
        const events = [...this.events]
        this.events = []
        events.forEach(ev => {
            this.addEvent(ev.target, ev.event, ev.callback)
        })
    }

    renderTemplate() {
        this.removeAllEvents()
        setTimeout(() => {
            const template = this.render()
            const routerView = this.shadowRoot.querySelector('router-view')
            this.shadowRoot.innerHTML = template
            if(routerView) {
                const currentRouterView = this.shadowRoot.querySelector('router-view')
                currentRouterView.replaceWith(routerView)
            }
            this.addEvents()
        }, 0)
    }

}