export interface ListDetails<T> {
  backdrop_path: string;
  id: number;
  name: string;
  description: string;
  sort_by: string;
  page: number;
  total_pages: number;
  total_results: number;
  results: T[];
}
