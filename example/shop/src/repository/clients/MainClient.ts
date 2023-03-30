import axios, { AxiosInstance } from 'axios'
import { BASE_URL } from '../../constants/confing'

export class MainClient {
    private static instance: AxiosInstance
    static getInstance(): AxiosInstance {
        if (!MainClient.instance) {
            MainClient.instance = axios.create({
                baseURL: BASE_URL
            })
        }
        return MainClient.instance
    }
}
