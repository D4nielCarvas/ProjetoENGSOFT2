import { Transaction } from '../context/TransactionContext';

const API_BASE_URL = 'http://localhost:5000/api';

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export interface FinancialSummary {
  revenues: number;
  expenses: number;
  balance: number;
  categories: Record<string, number>;
}

class ApiService {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          error: data.error || `Erro HTTP: ${response.status}`,
        };
      }

      return { data };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Erro de conexão',
      };
    }
  }

  // Autenticação
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    return this.request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  // Transações
  async getTransactions(): Promise<ApiResponse<Transaction[]>> {
    return this.request<Transaction[]>('/transactions');
  }

  async createTransaction(
    transaction: Omit<Transaction, 'id'>
  ): Promise<ApiResponse<Transaction>> {
    return this.request<Transaction>('/transactions', {
      method: 'POST',
      body: JSON.stringify(transaction),
    });
  }

  async updateTransaction(
    id: string,
    transaction: Partial<Omit<Transaction, 'id'>>
  ): Promise<ApiResponse<Transaction>> {
    return this.request<Transaction>(`/transactions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(transaction),
    });
  }

  async deleteTransaction(id: string): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>(`/transactions/${id}`, {
      method: 'DELETE',
    });
  }

  // Resumo financeiro
  async getFinancialSummary(): Promise<ApiResponse<FinancialSummary>> {
    return this.request<FinancialSummary>('/summary');
  }

  // Status da API
  async getApiStatus(): Promise<ApiResponse<{ status: string; version: string; timestamp: string }>> {
    return this.request('/status');
  }
}

export const apiService = new ApiService();
export default apiService;