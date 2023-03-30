import { PageElement } from 'web-component-router'
import { Product } from '../models/Product'

const styles = `
    .products {
        display: grid;
        grid-auto-columns: 1fr; 
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr; 
        gap: 1.5rem;
        margin: 2rem 10%;
    }
    
    
    .btn {
        all: unset;
        display: inline-block;
        font-family: inherit;
        font-size: var(--text-sm);
        font-weight: normal;
        line-height: inherit;
        text-align: center;
        user-select: none;
        vertical-align: middle;
        white-space: nowrap;
        border-radius: 0.25rem;
        text-transform: unset;
        transition: all 0.3s ease;
        cursor: pointer;
    }

    .btn-neutral {
        padding: 7px 15px;
        color: var(--white-500);
        border: var(--white-300) solid .2rem;
        box-shadow: var(--shadow-medium);
    }

      
`

export default class Products extends HTMLElement implements PageElement {
    static get observedAttributes() {
        return ['params']
    }

    private products: Product[] = []

    constructor() {
        super()
        this.attachShadow({ mode: 'open' })
        this.createStyles()
        this.products = JSON.parse(localStorage.getItem('cart') || '[]')
        if (this.products.length) this.createContent()
        else this.shadowRoot!.innerHTML = '<h1 style="text-align: center">Cart is empty!</h1>'
    }

    private createContent() {
        this.shadowRoot!.querySelector('.products')?.remove()
        this.shadowRoot!.innerHTML += `
            <div class="products">
                ${this.products.reduce((prev: string, cur: Product) => {
                    const product = `
                            <c-product-card 
                                product='${JSON.stringify(cur).replace(/\'/g, '')}'
                            >
                                <button class="btn btn-neutral" id="btn_${cur.id}">X</button>
                            </c-product-card>
                        `
                    return prev + product
                }, '')}
            </div>
        `
        this.products.forEach(({ id }) => {
            const btn = this.shadowRoot!.querySelector(`#btn_${id}`)! as HTMLElement
            btn.onclick = () => this.removeFromCart(id)
        })
    }

    private removeFromCart(id: number) {
        const index = this.products.findIndex(p => p.id === id)
        this.products.splice(index, 1)
        localStorage.setItem('cart', JSON.stringify(this.products))
        this.createContent()
    }

    private createStyles() {
        const styleEL = document.createElement('style')
        styleEL.innerHTML = styles
        this.shadowRoot!.append(styleEL)
    }
}
