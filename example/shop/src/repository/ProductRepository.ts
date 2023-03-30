import { AxiosResponse } from 'axios'
import { Category } from '../models/Category'
import { Product } from '../models/Product'
import { MainClient } from './clients/MainClient'

export class ProductRepository {
    private httpClient = MainClient.getInstance()
    private readonly route = '/products'
    getAllProducts(): Promise<AxiosResponse<Product[]>> {
        return this.httpClient.get<Product[]>(this.route)
    }

    getSingleProduct(id: number): Promise<AxiosResponse<Product>> {
        return this.httpClient.get<Product>(`${this.route}/${id}`)
    }

    getAllCategories(): Promise<AxiosResponse<Category[]>> {
        return this.httpClient.get<Category[]>(`${this.route}/categories`)
    }

    getInCategory(category: string): Promise<AxiosResponse<Product[]>> {
        return this.httpClient.get<Product[]>(`${this.route}/category/${category}`)
    }
}
