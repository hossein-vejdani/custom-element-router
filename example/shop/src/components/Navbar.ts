import { RepositoryFactory } from '../repository/RepositoryFactory'

const styles = `
    .navbar {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        height: 4rem;
        margin: 0 auto;
    }

    .brand {
        font-family: inherit;
        font-size: 1.6rem;
        font-weight: 600;
        line-height: 1.5;
        color: var(--black-500);
        text-transform: uppercase;
    }

    .menu {
        position: fixed;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100vh;
        overflow: hidden;
        background-color: var(--white-100);
        box-shadow: var(--shadow-medium);
        transition: all 0.4s ease-in-out;

    }
    .menu.is-active {
        left: 0;
    }
    .menu-inner {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        row-gap: 1.25rem;
        margin-top: 8rem;
        list-style: none;
    }
    .menu-link {
        font-family: inherit;
        font-size: var(--text-sm);
        font-weight: 600;
        line-height: 1.5;
        color: var(--black-500);
        text-transform: uppercase;
        transition: all 0.3s ease;
    }
    .menu-block {
        font-size: 1.5rem;
        text-align: center;
        color: var(--black-500);
    }
    @media only screen and (min-width: 48rem) {
        .menu {
            position: relative;
            left: 0;
            width: auto;
            height: auto;
            box-shadow: none;
        }
        .menu-inner {
            display: flex;
            flex-direction: row;
            column-gap: 1.75rem;
            margin: 0 auto;
        }
    }

    .burger {
        position: relative;
        display: block;
        order: -1;
        cursor: pointer;
        user-select: none;
        z-index: 10;
        width: 1.65rem;
        height: 1.15rem;
        rotate: 0deg;
        border: none;
        outline: none;
        visibility: visible;
        background: none;
        transition: 0.35s ease;
    }
    @media only screen and (min-width: 48rem) {
        .burger {
            display: none;
            visibility: hidden;
        }
    }
    .burger-line {
        position: absolute;
        display: block;
        left: 0;
        width: 100%;
        height: 2.1px;
        opacity: 1;
        rotate: 0deg;
        border: none;
        outline: none;
        border-radius: 1rem;
        background-color: var(--black-100);
        transition: 0.25s ease-in-out;
    }
    .burger-line:nth-child(1) {
        top: 0px;
    }
    .burger-line:nth-child(2) {
        top: 0.5rem;
        width: 70%;
    }
    .burger-line:nth-child(3) {
        top: 1rem;
    }
    .burger.is-active > .burger-line:nth-child(1) {
        top: 0.5rem;
        rotate: 135deg;
    }
    .burger.is-active > .burger-line:nth-child(2) {
        opacity: 0;
        visibility: hidden;
    }
    .burger.is-active > .burger-line:nth-child(3) {
        top: 0.5rem;
        rotate: -135deg;
    }

    .shop-button {
        cursor: pointer;
        user-select: none;
        border: none;
        outline: none;
        background: none;
    }

    `

type MenuItem = {
    title: string
    to: string
}
export default class Navbar extends HTMLElement {
    private items: MenuItem[] = []

    private repository = RepositoryFactory.get('product')
    constructor() {
        super()
        this.attachShadow({ mode: 'open' })
        this.createStyles()
        this.createContent()
        this.fetchCategories()
    }

    private async fetchCategories() {
        const cacheItems = JSON.parse(localStorage.getItem('menu_items') || '[]')
        this.items = cacheItems
        this.updateItems()
        const { data } = await this.repository.getAllCategories()

        this.items = [
            {
                title: 'Home',
                to: '/'
            },
            {
                title: 'All',
                to: '/products'
            },
            ...(data.map(item => ({
                title: item,
                to: `/products/${item}`
            })) as MenuItem[])
        ]
        localStorage.setItem('menu_items', JSON.stringify(this.items))
        this.updateItems()
    }

    private updateItems() {
        const menuInnerEl = this.shadowRoot!.querySelector('.menu-inner')!
        menuInnerEl.innerHTML = ''
        const itemEl = document.createElement('li')
        itemEl.classList.add('menu-item')
        const linkEl = document.createElement('router-link')
        linkEl.classList.add('menu-link')
        itemEl.append(linkEl)
        this.items.forEach(item => {
            const cloneItemEl = itemEl.cloneNode(true) as HTMLElement
            const cloneLinkEl = cloneItemEl.querySelector('.menu-link')! as HTMLElement
            cloneLinkEl.setAttribute('to', item.to)
            cloneLinkEl.innerText = item.title
            menuInnerEl.insertAdjacentElement('beforeend', cloneItemEl)
        })
    }

    private createContent() {
        this.shadowRoot!.querySelector('.navbar')?.remove()
        this.shadowRoot!.innerHTML += `
            <nav class="navbar">
                <h1 class="brand">
                    Shop
                </h1>
                <div class="menu">
                    <ul class="menu-inner">
                    </ul>
                </div>
                <div>
                    <router-link to="/panel">
                        <button class="menu-block shop-button">
                            <c-user-icon></c-user-icon>
                        </button>
                    </router-link>
                    <router-link to="/cart">
                        <button class="menu-block shop-button">
                            <c-bag-icon></c-bag-icon>
                        </button>
                    </router-link>
                </div>
            </nav>
        `
    }

    private createStyles() {
        const styleEL = document.createElement('style')
        styleEL.innerHTML = styles
        this.shadowRoot!.append(styleEL)
    }
}

customElements.define('c-navbar', Navbar)
