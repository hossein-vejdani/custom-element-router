import Component from "../core/BaseClasses/Component.js"

export default class Home extends Component {
    
    constructor() {
        super()
    }

    render() {
        return (
            `
                <div>
                  <h2>page2 - child3</h2>
                  <router-view></router-view>
                </div>
            `
        )
    }
}
