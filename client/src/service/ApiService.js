import axios from "axios";

// === Create an Axios instance with interceptors ===
const apiClient = axios.create({
    baseURL: process.env.REACT_APP_API_URL || "http://localhost:2424",
});

// === REQUEST INTERCEPTOR: Auto-attach auth token ===
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// === RESPONSE INTERCEPTOR: Centralized error handling ===
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // Auto-logout on 401 (expired/invalid token)
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            // Only redirect if not already on login page
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default class ApiService {

    /**AUTH && USERS API */
    static async registerUser(registration) {
        const response = await apiClient.post('/auth/register', registration);
        return response.data;
    }

    static async loginUser(loginDetails) {
        const response = await apiClient.post('/auth/login', loginDetails);
        return response.data;
    }

    static async getLoggedInUserInfo() {
        const response = await apiClient.get('/user/my-info');
        return response.data;
    }

    /**PRODUCT ENDPOINT */
    static async addProduct(formData) {
        const response = await apiClient.post('/product/create', formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
        return response.data;
    }

    static async updateProduct(formData) {
        const response = await apiClient.put('/product/update', formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
        return response.data;
    }

    static async getAllProducts() {
        const response = await apiClient.get('/product/get-all');
        return response.data;
    }

    static async searchProducts(searchValue) {
        const response = await apiClient.get('/product/search', {
            params: { searchValue }
        });
        return response.data;
    }

    static async getAllProductsByCategoryId(categoryId) {
        const response = await apiClient.get(`/product/get-by-category-id/${categoryId}`);
        return response.data;
    }

    static async getProductById(productId) {
        const response = await apiClient.get(`/product/get-by-product-id/${productId}`);
        return response.data;
    }

    static async deleteProduct(productId) {
        const response = await apiClient.delete(`/product/delete/${productId}`);
        return response.data;
    }

    /**CATEGORY */
    static async createCategory(body) {
        const response = await apiClient.post('/category/create', body);
        return response.data;
    }

    static async getAllCategory() {
        const response = await apiClient.get('/category/get-all');
        return response.data;
    }

    static async getCategoryById(categoryId) {
        const response = await apiClient.get(`/category/get-category-by-id/${categoryId}`);
        return response.data;
    }

    static async updateCategory(categoryId, body) {
        const response = await apiClient.put(`/category/update/${categoryId}`, body);
        return response.data;
    }

    static async deleteCategory(categoryId) {
        const response = await apiClient.delete(`/category/delete/${categoryId}`);
        return response.data;
    }

    /**ORDER */
    static async createOrder(body) {
        const response = await apiClient.post('/order/create', body);
        return response.data;
    }

    static async getAllOrders() {
        const response = await apiClient.get('/order/filter');
        return response.data;
    }

    static async getOrderItemById(itemId) {
        const response = await apiClient.get('/order/filter', {
            params: { itemId }
        });
        return response.data;
    }

    static async getAllOrderItemsByStatus(status) {
        const response = await apiClient.get('/order/filter', {
            params: { status }
        });
        return response.data;
    }

    static async updateOrderitemStatus(orderItemId, status) {
        const response = await apiClient.put(`/order/update-item-status/${orderItemId}`, {}, {
            params: { status }
        });
        return response.data;
    }

    /**ADDRESS */
    static async saveAddress(body) {
        const response = await apiClient.post('/address/save', body);
        return response.data;
    }

    /**AUTHENTICATION CHECKER */
    static logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
    }

    static isAuthenticated() {
        const token = localStorage.getItem('token');
        return !!token;
    }

    static isAdmin() {
        const role = localStorage.getItem('role');
        return role === 'ADMIN';
    }
}
