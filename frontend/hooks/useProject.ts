import { useState, useEffect } from 'react';
import { Case } from '../data/projects';
import { apiClient } from '../api/client';

interface UseProjectResult {
  project: Case | null;
  loading: boolean;
  error: string | null;
}

/**
 * Custom hook for fetching a single case by slug from Supabase
 */
export function useProject(slug: string | undefined): UseProjectResult {
  const [project, setProject] = useState<Case | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setProject(null);
      setLoading(false);
      return;
    }

    let isMounted = true;

    const fetchProject = async () => {
      setLoading(true);
      setError(null);

      const response = await apiClient.getProject(slug);

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
  }, [slug]);

  return { project, loading, error };
}
