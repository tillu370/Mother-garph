import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const api = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

// Types
export interface Entity {
  id: number;
  name: string;
  type: string;
  district: string;
  state: string;
  address?: string;
  website?: string;
  email?: string;
  phone?: string;
  description: string;
  relevance_score: number;
  priority_score: number;
  created_at: string;
}

export interface NGO {
  id: number;
  name: string;
  district: string;
  state: string;
  focus_areas: string[];
  website?: string;
  email?: string;
  description: string;
  alignment_score: number;
}

export interface Funder {
  id: number;
  name: string;
  type: string;
  focus_areas: string[];
  grant_size?: string;
  geography: string;
  website?: string;
  email?: string;
  description: string;
  relevance_score: number;
}

export interface ClassifyResult {
  type: string;
  confidence: number;
  reasoning: string;
}

export interface ScoreResult {
  score: number;
  reasoning: string[];
}

export interface EmailResult {
  subject: string;
  body: string;
}

export interface HeatmapData {
  district: string;
  count: number;
  lat: number;
  lng: number;
}

export interface DashboardStats {
  total_entities: number;
  total_ngos: number;
  total_funders: number;
  high_priority_leads: number;
  by_type: Record<string, number>;
  by_district: Record<string, number>;
}

// API calls
export const apiService = {
  // Dashboard
  getDashboardStats: () => api.get<DashboardStats>('/stats'),

  // Entities
  searchEntities: (filters: {
    state?: string;
    district?: string;
    type?: string;
    query?: string;
  }) => api.post<Entity[]>('/search', filters),

  getEntity: (id: number) => api.get<Entity>(`/entities/${id}`),

  ingestEntity: (data: {
    name: string;
    website?: string;
    description: string;
    type?: string;
    district?: string;
    state?: string;
    email?: string;
    phone?: string;
  }) => api.post<Entity>('/ingest', data),

  // Classification
  classifyEntity: (description: string) =>
    api.post<ClassifyResult>('/classify', { description }),

  // Scoring
  scoreEntity: (entity_id: number) =>
    api.post<ScoreResult>('/score', { entity_id }),

  // NGOs
  getNGOs: (query?: string) => api.get<NGO[]>('/ngos', { params: { query } }),

  matchNGOs: (program_description: string) =>
    api.post<NGO[]>('/match-ngos', { program_description }),

  // Funders
  getFunders: (filters?: { type?: string; geography?: string }) =>
    api.get<Funder[]>('/funders', { params: filters }),

  // Priority
  getPriorityRanking: () => api.get<Entity[]>('/priority-ranking'),

  // Email
  generateEmail: (organization_name: string, type: string) =>
    api.post<EmailResult>('/generate-email', { organization_name, type }),

  // Heatmap
  getHeatmap: () => api.get<HeatmapData[]>('/heatmap'),

  // Seed data
  seedData: () => api.post('/seed'),
};
