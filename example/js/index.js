'use strict'
import Router from '../router/index.js'
import home from '../pages/index.js'
const routes = [
    {
        name: '404',
        path: '*',
        page: () => import('../pages/404.js'),
    },
    {
        name: 'home',
        path: '/',
        page: home
    },
    {
        name: 'page2',
        path: '/page2',
        // redirect: '/page3'
        page: () => import('../pages/page2.js'),
        children: [
            {
                name: 'page2-child1',
                path: 'child1',
                page: () => import('../pages/page2-child1.js'),
            },
            {
                name: 'page2-child2',
                path: 'child2',
                page: () => import('../pages/page2-child2.js'),
            },
            {
                name: 'page2-child3',
                path: 'child3',
                page: () => import('../pages/page2-child3.js'),
                children: [
                    {
                        name: 'page2-child31',
                        path: 'child31',
                        page: () => import('../pages/page2-child3-1.js'),
                    },
                ]
            },
        ]
    },
    {
        name: 'page3',
        path: '/page3',
        page: () => import('../pages/page3.js'),
        beforeEnter(from, to, next) {
            next()
        }
    },
    {
        name: 'page4',
        path: '/page4/:id',
        meta: {
            title: 'Title: Page4'
        },
        children: [
            {
                name: 'page4-child1',
                path: 'child1',
                meta: {
                    title: 'Title: Page4-c1'
                },
                page: () => import('../pages/page4-child1.js'),
            },
        ],
        page: () => import('../pages/page4.js'),
        beforeEnter(from, to, next) {
            next()
        }
    },
]


window.router = new Router({
    mode: 'hash',
    routes,
})

window.router.setRouteListener('beforeEach', (from, to, next) => {
    console.log('beforeEach', from, to)
    next()
})
