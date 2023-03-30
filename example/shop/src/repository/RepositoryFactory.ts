import { ProductRepository } from './ProductRepository'

const repositories = {
    product: new ProductRepository()
}

export class RepositoryFactory {
    static get(name: keyof typeof repositories) {
        return repositories[name]
    }
}
