import Component from "../core/BaseClasses/Component.js"

export default class Home extends Component {
    
    constructor() {
        super()
    }

    render() {
        return (
            `
                <div>
                    <h1>Page2</h1>
                    <router-view></router-view>
                </div>
            `
        )
    }
}
