import { PageElement } from 'web-component-router'
import { Product } from '../models/Product'
import { RepositoryFactory } from '../repository/RepositoryFactory'

const styles = `
    .products {
        display: grid;
        grid-auto-columns: 1fr; 
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr; 
        gap: 1.5rem;
        margin: 2rem 10%;
    }
`

export default class Products extends HTMLElement implements PageElement {
    static get observedAttributes() {
        return ['params']
    }

    private repository = RepositoryFactory.get('product')

    private products: Product[] = []

    constructor() {
        super()
        this.attachShadow({ mode: 'open' })
        this.createStyles()
    }

    createContent() {
        this.shadowRoot!.querySelector('.products')?.remove()
        this.shadowRoot!.innerHTML += `
            <div class="products">
                ${this.products.reduce((prev: string, cur: Product) => {
                    const product = `
                            <c-product-card 
                                product='${JSON.stringify(cur).replace(/\'/g, '')}'
                            ></c-product-card>
                        `
                    return prev + product
                }, '')}
            </div>
        `
    }

    private showLoading() {
        this.shadowRoot!.innerHTML = ''
        this.createStyles()
        this.shadowRoot!.innerHTML += `
            <h1 id="loading" style="text-align: center">loading...</h1>
        `
    }

    private hideLoading() {
        this.shadowRoot!.querySelector('#loading')?.remove()
    }

    private async fetchProducts(category?: string) {
        this.showLoading()
        if (category) {
            const { data } = await this.repository.getInCategory(category)
            this.products = data
        } else {
            const { data } = await this.repository.getAllProducts()
            this.products = data
        }
        this.hideLoading()
        this.createContent()
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        const params = JSON.parse(newValue)
        this.fetchProducts(params.category)
    }

    private createStyles() {
        const styleEL = document.createElement('style')
        styleEL.innerHTML = styles
        this.shadowRoot!.append(styleEL)
    }
}
