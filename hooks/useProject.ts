import { useState, useEffect } from 'react';
import { Project } from '../data/projects';
import { apiClient } from '../api/client';

interface UseProjectResult {
  project: Project | null;
  loading: boolean;
  error: string | null;
}

/**
 * Custom hook for fetching a single project from API
 */
export function useProject(id: number | undefined): UseProjectResult {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setProject(null);
      setLoading(false);
      return;
    }

    let isMounted = true;

    const fetchProject = async () => {
      setLoading(true);
      setError(null);

      const response = await apiClient.getProject(id);

      if (!isMounted) return;

      if (response.error) {
        setError(response.error);
        setProject(null);
      } else if (response.data) {
        setProject(response.data);
      }

      setLoading(false);
    };

    fetchProject();

    return () => {
      isMounted = false;
    };
  }, [id]);

  return { project, loading, error };
}
