import { Client } from '@gradio/client';
import { AnalysisResult } from '../types';

const GRADIO_URL = (import.meta as any).env?.VITE_GRADIO_URL || 'http://127.0.0.1:7860';

let clientInstance: Client | null = null;

export async function getGradioClient(): Promise<Client> {
  if (!clientInstance) {
    clientInstance = await Client.connect(GRADIO_URL);
  }
  return clientInstance;
}

export async function synthesizeSketch(file: File): Promise<AnalysisResult> {
  const client = await getGradioClient();
  const response = await client.predict('/analyze', [file]);
  const rawData = (response.data as any)[0];
  const data: AnalysisResult = typeof rawData === 'string' ? JSON.parse(rawData) : rawData;

  if (!data.entities && data.prismaSchema) {
    const modelRegex = /model\s+(\w+)\s*\{([^}]+)\}/g;
    const entities = [];
    let match;

    while ((match = modelRegex.exec(data.prismaSchema)) !== null) {
      const name = match[1];
      const body = match[2];
      const fieldLines = body
        .split('\n')
        .map(l => l.trim())
        .filter(l => l.length > 0 && !l.startsWith('//') && !l.startsWith('@@'));

      entities.push({
        name,
        fieldsCount: fieldLines.length,
        relationships: ['1:N Related']
      });
    }

    data.entities = entities;
  }

  return data;
}
