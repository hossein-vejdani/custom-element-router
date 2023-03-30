import { PageElement } from 'web-component-router'

const styles = `
    .hero-section {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 0 7%;
        height: 60vh;
        min-height: 30rem;
        color: var(--black-500);
    }
    
    .hero-text {
        padding: 2rem;
        text-align: center;
    }
    
    .hero-text h1 {
        font-size: 4rem;
        font-weight: bold;
        text-transform: uppercase;
        letter-spacing: 2px;
        animation: text-slide-in 1s ease-out;
    }
    
    .hero-text p {
        font-size: 2rem;
        font-weight: lighter;
        margin-top: 1rem;
    }
    
    .hero-image {
        width: 40%;
        overflow: hidden;
        animation: image-fade-in 1s ease-out;
    }
    
    .hero-image img {
        width: 100%;
        object-fit: cover;
    }
    
    @keyframes text-slide-in {
        0% {
            transform: translateX(-100%);
        }
        100% {
            transform: translateX(0%);
        }
    }
    
    @keyframes image-fade-in {
        0% {
            opacity: 0;
        }
        100% {
            opacity: 1;
        }
    }
`
export default class Home extends HTMLElement implements PageElement {
    constructor() {
        super()
        this.attachShadow({ mode: 'open' })
        this.shadowRoot!.innerHTML = `
            <style>${styles}</style>
            <section class="hero-section">
                <div class="hero-text">
                    <h1>SHOP</h1>
                    <p>This is an example of web component router</p>
                    </div>
                    <div class="hero-image">
                    <img src="https://media.istockphoto.com/id/1302787124/photo/beige-leather-women-handbag-isolated-on-white-background.jpg?s=612x612&w=0&k=20&c=fOO0zCBqF3rbiGLLHwgtOMHxt66adpKikE7Fs2C_fDs=">
                </div>
            </section>
            <router-view></router-view>
            
            `
    }

    connectedCallback() {
        console.log(this.getAttribute('query-params'))
    }
}
