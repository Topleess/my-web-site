import { useState, useEffect } from 'react';
import { Project } from '../data/projects';
import { apiClient } from '../api/client';

interface UseProjectsResult {
  projects: Project[];
  loading: boolean;
  error: string | null;
  total: number;
}

interface UseProjectsParams {
  category?: string;
  status?: string;
  limit?: number;
}

/**
 * Custom hook for fetching projects from API
 */
export function useProjects(params?: UseProjectsParams): UseProjectsResult {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    let isMounted = true;

    const fetchProjects = async () => {
      setLoading(true);
      setError(null);

      const response = await apiClient.getProjects(params);

      if (!isMounted) return;

      if (response.error) {
        setError(response.error);
        setProjects([]);
        setTotal(0);
      } else if (response.data) {
        setProjects(response.data.projects);
        setTotal(response.data.total);
      }

      setLoading(false);
    };

    fetchProjects();

    return () => {
      isMounted = false;
    };
  }, [params?.category, params?.status, params?.limit]);

  return { projects, loading, error, total };
}
