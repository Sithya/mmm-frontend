/**
 * TypeScript type definitions
 */

export interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface OrganizationMember {
  id: number;
  name: string;
  category: string;
  affiliation: string;
  photo_url: string;
}

export type RegistrationType =
  | "student"
  | "standard"
  | "early_bird";


