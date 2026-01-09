import { Project } from '../data/projects';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export interface ProjectsListResponse {
  projects: Project[];
  total: number;
}

export interface CategoriesResponse {
  categories: Array<{
    name: string;
    count: number;
  }>;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return { data };
    } catch (error) {
      console.error('API request failed:', error);
      return { 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      };
    }
  }

  /**
   * Get all projects with optional filters
   */
  async getProjects(params?: {
    category?: string;
    status?: string;
    limit?: number;
  }): Promise<ApiResponse<ProjectsListResponse>> {
    const queryParams = new URLSearchParams();
    
    if (params?.category && params.category !== 'Все') {
      queryParams.append('category', params.category);
    }
    if (params?.status) {
      queryParams.append('status', params.status);
    }
    if (params?.limit) {
      queryParams.append('limit', params.limit.toString());
    }
    
    const query = queryParams.toString();
    const endpoint = `/api/projects${query ? `?${query}` : ''}`;
    
    return this.request<ProjectsListResponse>(endpoint);
  }

  /**
   * Get a single project by ID
   */
  async getProject(id: number): Promise<ApiResponse<Project>> {
    return this.request<Project>(`/api/projects/${id}`);
  }

  /**
   * Get all categories with counts
   */
  async getCategories(): Promise<ApiResponse<CategoriesResponse>> {
    return this.request<CategoriesResponse>('/api/categories');
  }

  /**
   * Check API health
   */
  async healthCheck(): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>('/api/health');
  }
}

// Export singleton instance
export const apiClient = new ApiClient(API_URL);
