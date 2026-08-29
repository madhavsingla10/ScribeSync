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

  if (!data.entities) {
    const extractedModels = (data.prismaSchema.match(/model\s+(\w+)/g) || []).map(m => m.replace('model ', ''));
    data.entities = extractedModels.map(name => ({
      name,
      fieldsCount: 5,
      relationships: ['1:N Related']
    }));
  }

  return data;
}
