import { Product } from '../models/Product'

const styles = `
    * {
        box-sizing: border-box
    }
    .product-card {
        --transitionDuration: 1s;
        background-color: var(--white-100);
        box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1);
        color: var(--white-500);
        width: 100%;
        height: 27rem;
        letter-spacing: 1px;
        border-radius: 1.4rem;
        overflow: hidden;
        position: relative;
        padding: 1rem;
        /* Flex */
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .product-card::after {
        background-color: var(--white-300);
        width: 400px;
        height: 400px;
        border-radius: 50%;
        z-index: 0;
        transition-duration: calc(var(--transitionDuration) / 2);
        transition-property: width, height, transform;
        transition-timing-function: ease-in-out;
        content: '';
        position: absolute;
        right: 0;
        top: 0;
        transform: translate(45%, -45%);
    }

    .product-card:hover::after {
        width: 500px;
        height: 500px;
        transform: translate(30%, -62%);;
    }

    .img {
        width: 85%;
        height: 16rem;
        z-index: 1;
        transition: transform var(--transitionDuration);
        border-radius: 1.4rem;
        /* Position */
        position: absolute;
        left: 50%;
        top: 35%;
        transform: translate(-50%, -40%);
        will-change: top;
    }

    .product-card:hover .img {
        transform: translate(-50%, -50%);
    }

    .title {
        font-weight: 600;
        transition: transform var(--transitionDuration);
        position: absolute;
        left: 50%;
        width: 85%;
        height: 10%;
        font-size: 1rem;
        overflow: hidden;
        top: 65%;
        color: var(--black-500);
        transform: translate(-50%, 100%);
        transform-origin: top;
        will-change: top;
    }

    .product-card:hover .title {
        transform: translate(-50%, 0);
    }

    .content {
        font-weight: 300;
        text-transform: uppercase;
        position: absolute;
        left: 50%;
        top: 90%;
        transform: translate(-50%, 150%);
        justify-content: center;
        transition: all var(--transitionDuration);
        display: flex;
        align-items: center;
        width: 100%;
        gap: .5rem;
        
    }

    .product-card:hover .content {
        transform: translate(-50%, -50%);
    }


    .link {
        background-color: var(--white-300);
        color: var(--black-500);
        padding: 10px 15px;
        text-decoration: none;
        font-weight: 600;
        border-radius: 3px;
        box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1);
        border-radius: .5rem;
    }


    .link:hover {
        background-color: var(--black-500);
        color: var(--white-100);
    }
  
`

export default class ProductCard extends HTMLElement {
    static get observedAttributes() {
        return ['product']
    }

    private product?: Product

    constructor() {
        super()
        this.attachShadow({ mode: 'open' })
        this.createStyles()
    }

    private createContent() {
        this.shadowRoot!.querySelector('.product-card')?.remove()
        this.shadowRoot!.innerHTML += `
        <div class='product-card'>
            <img 
            src='${this.product?.image}' class='img'>
            <h2 class='title'>${this.product?.title}</h2>
            <div class='content'>
                <router-link to='/single-product/${this.product?.id}' class='link'>Buy $${this.product?.price}</router-link>
                <slot></slot>
            </div>
        </div>
        `
    }

    attributeChangedCallback(name: keyof Product, oldValue: string, newValue: string) {
        this.product = JSON.parse(newValue)
        this.createContent()
    }

    private createStyles() {
        const styleEL = document.createElement('style')
        styleEL.innerHTML = styles
        this.shadowRoot!.append(styleEL)
    }
}

customElements.define('c-product-card', ProductCard)
