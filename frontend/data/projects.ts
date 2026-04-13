export type Category = string;

export interface MediaItem {
  url: string;
  type: string;
  alt: {
    en: string;
    ru: string;
  };
}

export interface MetricItem {
  label: {
    en: string;
    ru: string;
  };
  value: string;
}

export interface Case {
  id: string;
  slug: string;
  title: string;
  title_en?: string | null;
  title_ru?: string | null;
  category_en: string;
  category_ru: string;
  image: string;
  size: 'large' | 'small';
  description_en: string;
  description_ru: string;
  full_description_en?: string | null;
  full_description_ru?: string | null;
  challenge_en?: string | null;
  challenge_ru?: string | null;
  solution_en?: string | null;
  solution_ru?: string | null;
  results_en?: string | null;
  results_ru?: string | null;
  tags?: string[] | null;
  metrics?: MetricItem[] | null;
  media?: MediaItem[] | null;
  published?: boolean;
  sort_order?: number;
  created_at?: string;
  niche_en?: string | null;
  niche_ru?: string | null;
  client_en?: string | null;
  client_ru?: string | null;
  period_en?: string | null;
  period_ru?: string | null;
  format_en?: string | null;
  format_ru?: string | null;
}

export type Project = Case;