import Component from "../core/BaseClasses/Component.js"

export default class Home extends Component {
    
    constructor() {
        super()
        this.state = {
            title: '',
            counter: 0
        }
    }

    connectedCallback() {
        this.addEvent('#btn1', 'click', () => { this.increase() })
        this.addEvent('#btn2', 'click', () => { this.decrease() })
        this.router.setRouteListener('onload', route => {
            this.setState('title', route.meta?.title)
            console.log(route)
            // this.setState('counter', +route.params?.id)
        })
    }

    increase() {
        this.setState('counter', this.state.counter + 1)
    }

    decrease() {
        this.setState('counter', this.state.counter - 1)
    }
    
    render() {
        return (
            `
                <h1>${this.state.title}</h1>
                <p>${this.state.counter}</p>
                <div>
                    <button id="btn1">+</button>
                    <button id="btn2">-</button>
                </div>
                <router-view></router-view>
            `
        )
    }
}
