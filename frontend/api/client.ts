import { createClient } from '@supabase/supabase-js';
import { Case } from '../data/projects';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export interface ProjectsListResponse {
  projects: Case[];
  total: number;
}

export interface CategoriesResponse {
  categories: Array<{
    name: string;
    name_en?: string;
    name_ru?: string;
    count: number;
  }>;
}

class ApiClient {
  /**
   * Get all cases with optional filters
   */
  async getProjects(params?: {
    category?: string;
    limit?: number;
    lang?: string;
  }): Promise<ApiResponse<ProjectsListResponse>> {
    try {
      let query = supabase
        .from('cases')
        .select('*')
        .eq('published', true)
        .order('sort_order', { ascending: true });

      if (params?.category && params.category !== 'Все' && params.category !== 'All') {
        query = query.or(`category_ru.eq.${params.category},category_en.eq.${params.category}`);
      }

      if (params?.limit) {
        query = query.limit(params.limit);
      }

      const { data, error } = await query;

      if (error) return { error: error.message };

      return {
        data: {
          projects: (data as Case[]) || [],
          total: data?.length || 0,
        },
      };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Unknown error' };
    }
  }

  /**
   * Get a single case by slug
   */
  async getProject(slug: string): Promise<ApiResponse<Case>> {
    try {
      const { data, error } = await supabase
        .from('cases')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .single();

      if (error) return { error: error.message };
      return { data: data as Case };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Unknown error' };
    }
  }

  /**
   * Get all categories with counts
   */
  async getCategories(lang?: string): Promise<ApiResponse<CategoriesResponse>> {
    try {
      const { data, error } = await supabase
        .from('cases')
        .select('category_ru, category_en')
        .eq('published', true);

      if (error) return { error: error.message };

      const counts: Record<string, { ru: string; en: string; count: number }> = {};
      for (const row of data || []) {
        const key = row.category_ru as string;
        if (!counts[key]) {
          counts[key] = { ru: row.category_ru, en: row.category_en, count: 0 };
        }
        counts[key].count++;
      }

      const totalCount = data?.length || 0;
      const allLabel = lang === 'en' ? 'All' : 'Все';

      const categories = [
        { name: allLabel, name_en: 'All', name_ru: 'Все', count: totalCount },
        ...Object.values(counts).map(({ ru, en, count }) => ({
          name: lang === 'en' ? en : ru,
          name_en: en,
          name_ru: ru,
          count,
        })),
      ];

      return { data: { categories } };
    } catch (err) {
      return { error: err instanceof Error ? err.message : 'Unknown error' };
    }
  }
}

export const apiClient = new ApiClient();
