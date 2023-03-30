import { Route, Router } from 'web-component-router'
import Home from '../pages/Index'

const routes: Route[] = [
    {
        name: 'not-found',
        path: '/*',
        page: () => import('../pages/NotFound')
    },
    {
        name: 'home',
        path: '/',
        page: Home,
        children: [
            {
                name: 'products',
                path: '/products/:category?',
                page: () => import('../pages/Products')
            }
        ]
    },
    {
        name: 'panel',
        path: '/panel',
        page: () => import('../pages/Panel')
    },
    {
        name: 'single-product',
        path: '/single-product/:id',
        page: () => import('../pages/SingleProduct')
    },
    {
        name: 'cart',
        path: '/cart',
        page: () => import('../pages/Cart')
    }
]

export const router = new Router({
    mode: 'hash',
    routes
})

router.setListener('beforeEach', (from, to, next) => {
    if (to.path === '/panel') {
        const hasAccess = confirm('Do you want to access in panel?')
        if (hasAccess) next()
        else next('/404')
    }
    next()
})
