export interface Endpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  description: string;
  requestBody?: string;
  responseBody?: string;
}

export interface EntitySummary {
  name: string;
  fieldsCount: number;
  relationships: string[];
}

export interface ArchInsight {
  category: 'caching' | 'indexing' | 'scaling' | 'security';
  title: string;
  description: string;
  impact: 'High' | 'Medium' | 'Low';
}

export interface AnalysisResult {
  title: string;
  summary: string;
  mermaidDiagram: string;
  prismaSchema: string;
  sqlSchema: string;
  endpoints: Endpoint[];
  entities?: EntitySummary[];
  insights?: ArchInsight[];
  stats?: {
    totalEntities: number;
    totalRelations: number;
    totalEndpoints: number;
    queryComplexityScore: string;
  };
}

export type ActiveView = 'landing' | 'processing' | 'results';
export type TabType = 'diagram' | 'prisma' | 'sql' | 'api' | 'insights';
