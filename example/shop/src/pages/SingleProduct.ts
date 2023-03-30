import { PageElement } from 'web-component-router'
import { Product } from '../models/Product'
import { RepositoryFactory } from '../repository/RepositoryFactory'
import { router } from '../router'

const styles = `
    
    .section {
        margin: 0 auto;
        padding: 6rem 0 2rem;
    }
    .wrapper-column {
        display: grid;
        row-gap: 2rem;
        align-items: center;
        margin-top: 4rem;
    }
    @media only screen and (min-width: 48rem) {
        .wrapper-column {
            grid-template-columns: 1fr 1fr;

            align-content: center;
            justify-content: center;
            column-gap: 4rem;
            margin-top: 2rem;
            width: 80%;
            margin: auto;
        }
    }

    .text-md {
        font-size: var(--text-md);
        line-height: inherit;
    }
     
    .heading-sm {
        font-size: var(--display-sm);
        line-height: 1.15;
        letter-spacing: -1px;
    }
    .font-semi {
        font-weight: 600;
    }
      
   
    .font-bold {
        font-weight: 700;
    }
    
    .text-xxl {
        font-size: var(--text-xxl);
        line-height: inherit;
    }
    
    .btn {
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
    .btn-darken {
        padding: 0.65rem 2.75rem;
        color: var(--white-100);
        background-color: var(--black-500);
        box-shadow: var(--shadow-medium);
    }

    .badge-darken {
        padding: 0.2rem 0.65rem;
        color: var(--white-100);
        background-color: var(--black-500);
    }
  
    .badge {
        font-family: inherit;
        font-size: var(--text-xs);
        font-weight: normal;
        line-height: 1.15;
        text-align: center;
        white-space: nowrap;
        vertical-align: middle;
        border-radius: 1rem;
        text-transform: unset;
    }
    
    .wrapper-figure {
        position: relative;
        align-items: center;
        justify-self: center;
    }
    .wrapper-figure::before {
        position: absolute;
        display: block;
        content: "";
        top: 50%;
        left: 50%;
        z-index: -2;
        width: 135%;
        border-radius: 50%;
        padding-bottom: 135%;
        translate: -50% -50%;
        background-color: var(--brown-300);
    }
    .wrapper-image {
        display: block;
        max-width: 17rem;
        height: auto;
        scale: 1.25;
        translate: 1rem;
        width: 75%;
        border-radius: 1rem;
        margin: auto;
        filter: drop-shadow(0px 8px 8px rgba(15, 15, 15, 0.4));
    }
    @media only screen and (min-width: 48rem) {
        .wrapper-image {
        max-width: 20rem;
        }
    }
    @media only screen and (min-width: 64rem) {
        .wrapper-image {
        max-width: 24rem;
        }
    }
    .wrapper-content {
        display: flex;
        flex-direction: column;
        justify-content: center;
        row-gap: 1.5rem;
        margin-block: 4rem 2rem;
    }
    .wrapper-inform {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        row-gap: 0.75rem;
    }
    .wrapper-detail {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .wrapper-action {
        display: flex;
        align-items: center;
        column-gap: 1rem;
        margin-top: 1rem;
    }
    .wrapper-action .btn-neutral {
        font-size: 1.5rem;
        line-height: 1.5rem;
        padding: 0.5rem 1rem;
    }
    
    .sizes,
    .price {
        display: flex;
        flex-direction: column;
        justify-content: center;
        row-gap: 0.5rem;
    }
    
    .sizes-list {
        display: flex;
        column-gap: 0.25rem;
        padding-right: 1.5rem;
    }
    .sizes-item {
        font-family: inherit;
        font-size: 1rem;
        line-height: 2rem;
        cursor: pointer;
        user-select: none;
        width: 2rem;
        height: 2rem;
        text-align: center;
        border-radius: 0.25rem;
        transition: all 0.2s ease;
    }
    .sizes-item.is-select {
        font-weight: 500;
        color: var(--white-100);
        background-color: var(--brown-500);
    }
`

export default class SingleProduct extends HTMLElement implements PageElement {
    static get observedAttributes() {
        return ['params']
    }

    private repository = RepositoryFactory.get('product')
    private product?: Product

    constructor() {
        super()
        this.attachShadow({ mode: 'open' })
    }

    private createContent() {
        this.shadowRoot!.innerHTML = `
            <style>${styles}</style>
            <section class="section wrapper wrapper-section">
                <div class="wrapper-column">
                    <div class="wrapper-figure">
                        <img src="${this.product?.image}" class="wrapper-image" loading="lazy" alt="Sneaker">
                    </div>
                    <div class="wrapper-content">
                        <div class="wrapper-inform">
                            <span class="badge badge-darken">${this.product?.category}</span>
                            <h1 class="heading-sm font-bold">${this.product?.title}</h1>
                            <p class="text-md font-regular">
                                ${this.product?.description}
                            </p>
                        </div>
                        <div class="wrapper-detail">
                            <div class="price">
                                <span class="text-md font-semi">Price:</span>
                                <h3 class="text-xxl font-bold">$${this.product?.price}</h3>
                            </div>
                        
                        </div>
                        <div class="wrapper-action">
                            <button class="btn btn-darken">Add to cart</button>
                        </div>
                    </div>
                </div>
            </section>
        `
        const cartBtn = this.shadowRoot!.querySelector('.btn')! as HTMLElement
        cartBtn.onclick = () => {
            this.addToCard()
        }
    }

    private addToCard() {
        const itemsInCart: Product[] = JSON.parse(localStorage.getItem('cart') || '[]')
        const isExist = itemsInCart.some(item => item.id === this.product?.id)
        if (isExist) alert('product already exists in cart')
        else {
            this.product && itemsInCart.unshift(this.product)
            localStorage.setItem('cart', JSON.stringify(itemsInCart))
            router.push('/cart')
        }
    }

    private async fetchProduct(id: number) {
        const { data } = await this.repository.getSingleProduct(id)
        this.product = data
        this.createContent()
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        const params = JSON.parse(newValue)
        this.fetchProduct(params.id)
    }
}
