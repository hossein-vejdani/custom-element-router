[![router!](https://i.ibb.co/BPsfR4h/router-banner.png)](https://i.ibb.co/BPsfR4h/router-banner.png)
## Introduction:
This package provides a router for web components. You can use this package to create a SPA (Single Page Application) using web components.


## Installation
You can install the router package using npm or yarn:
```bash
npm install custom-element-router
```

## Quick Start
### 1. Add a router-view tag to your main HTML file
```bash
<router-view></router-view>
```
### 2. Import Router
```bash
import { Router, Route } from 'custom-element-router';
```

### 3. Define your routes
```bash
import Home from './pages/Home';
const routes: Route[] = [
  {
    name: 'home',
    path: '/',
    page: Home
  },
  {
    name: 'products',
    path: '/products',
    page: () => import('./pages/Products')
  },
  {
    name: '404',
    path: '/*',
    page: () => import('./pages/NotFound')
  }
];
```

Here, routes is an array of route objects. Each route object should have 

a unique `name`,

a unique `path` that starts with a forward slash /,

and a `page` that is a web component class or a dynamic import function that returns a web component class.

You can also define optional `redirect` and `children` keys for each route object. The children key can be used to define child routes with recursive configuration.

### 4. Create an instance of the Router class:
``` bash
const router = new Router({
  routes,
  mode: 'hash' // or 'history'
});
```

### 5. Define custom elements for each page
```bash
export default class Home extends HTMLElement implements PageElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot!.innerHTML = `
      <h1>Home</h1>
    `;
  }
}

```

### 5. Listen on events(optional)
Listen to route changes
``` bash
router.setListener('change', (route: Route) => {
  console.log('Route changed:', route.path);
});
router.setListener('load', (route: Route) => {
  console.log('Route loaded:', route.path);
});
```

## Configuration
The configuration object for the Router class has two keys:

* routes: an array of route objects that define the path and page for each route.
* mode: a string that determines the routing mode, which can be "hash" or "history".
### Route Object
Each route object in the routes array has the following keys:

* name: a required string that must be unique.
* path: a required string that represents the route path and should start with a forward slash ("/").
* page: a web component class that will be displayed when the user navigates to this route. You can also use dynamic imports for lazy-loading, like this: `() => import('./pages/Home')`.
* redirect: an optional string that represents a route path to redirect to if this route is accessed.
* children: an optional array of route objects that define child routes for this route.
## Defining Custom Elements For Pages
To define custom elements, you should write a class that extends HTMLElement and implements the `PageElement` interface. The `PageElement` interface has a single key shadowRoot which is a `ShadowRoot` or `null`.

In the class constructor, you should call `super()` and then `this.attachShadow({ mode: 'open' })`.

```bash
export default class Home extends HTMLElement implements PageElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot!.innerHTML = `
      <h1>Home</h1>
    `;
  }
}
```

## Navigating Between Routes
To navigate in your HTML code, you should use the `<router-link>` tag instead of the `<a>` tag. This tag has an attribute `to`.
```bash
<router-link to="/path/to"></router-link>
```
In JavaScript code, you can call the push method in your router instance:
```bash
router.push('/path/to');
# or
router.go(-1);
```

## Parameters
You can set parameters to a route by defining them in the `path` as `/:parameterName`. You can also define multiple parameters by separating them with a forward slash: 
`/:parameterName1/:parameterName2`.

You can also define optional parameters by using a question mark `?` at the end of the parameter name: `/:parameterName?`.

The parameters are set as an attribute on your component, and you can use it in your page element:
```bash
export default class User extends HTMLElement implements PageElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        console.log(this.getAttribute('params'));
    }
}
```

You can also observe the `params` attribute by adding the observedAttributes static getter to your class:
```bash
export default class User extends HTMLElement implements PageElement {
    static get observedAttributes() {
        return ['params'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        console.log(newValue);
    }

    constructor() {
        super()
        this.attachShadow({ mode: 'open' })
    }
}
```
## Query parameters
If your URL has query parameters, like this: `http://example.com/product?name=test&category=shoes`, you can access them in your page web component by adding an attribute named `query-params` to the component. The attribute value will be a string representing the query parameters.

Here's an example of how to use the `query-params` attribute in your page web component:

```bash
export default class User extends HTMLElement implements PageElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        console.log(this.getAttribute('query-params'));
    }
}
```

You can also observe the `query-params` attribute by adding the observedAttributes static getter to your class:
```bash
export default class User extends HTMLElement implements PageElement {
    static get observedAttributes() {
        return ['query-params'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        console.log(newValue);
    }

    constructor() {
        super()
        this.attachShadow({ mode: 'open' })
    }
}
```
## Nested Routes
You can create nested routes by defining a route with children property, which is an array of routes. These routes can also have their own children, creating a nested hierarchy of routes.

For example:
```bash
const routes = [
    {
        name: 'panel',
        path: '/panel',
        page: Panel,
        children: [
            {
                name: 'panel-user',
                path: '/user/:id',
                page: User,
            },
            {
                name: 'panel-product',
                path: '/product/:id',
                page: () => import("./pages/Product"),
            },
        ],
    },
];
```

In this example, the `panel` route has two children routes: `panel-user` and `panel-product`. When navigating to `/panel/user/1`, the `panel` route will load its page, and the `panel-user` route will load its page as a child of the `panel` page.


## Router guard
You can use a router guard to protect certain routes and ensure that the user has the appropriate access rights before accessing them. To do this, you can listen to the `beforeEach` event on the router object, and use the next function to control the routing flow.

Here's an example of how to use a router guard:
```bash
router.setListener('beforeEach', (from, to, next) => {
    if (to.path === '/panel') {
        if (!hasAccess) {
            return next('/403');
        }
    }
    next();
});
```
In this example, the router guard checks whether the user is trying to access the panel route. If user has permission to access the route. If the user has access, the next function is called to proceed. Otherwise, it redirects the user to the "/403" route.
## Example
To help you get started with this package, we have created an example project that uses the package to build a simple online shop. The example project uses the Fake Store API to display products, and it demonstrates how to use the router to navigate between different pages.

You can check out the example project by visiting this link: https://router-shop.000webhostapp.com/

In this example project, you will see how to use the router to:

* Define routes for different pages, such as the home page, product page, and cart page
* Load web components dynamically using the import() function
* Use router guards to protect certain routes
* Navigate between pages using links and programmatic navigation

We hope this example project will help you understand how to use this package in your own projects. 
## Contribute
We welcome contributions to this npm package. If you have any suggestions, bug reports, or feature requests, please create an issue on the GitHub repository.

If you want to contribute code to this package, please follow these steps:
```
1. Fork the repository and create a new branch for your changes.
2. Submit a pull request with your changes.
```
We will review your pull request as soon as possible. Thank you for your contributions!
## Conclusion
That's it! With this router, you can easily add client-side routing to your web components. If you have any questions or suggestions, feel free to create an issue on the GitHub repository.