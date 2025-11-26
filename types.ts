export interface PlantAnalysis {
  isPlant: boolean;
  healthy: boolean;
  diseaseName: string;
  confidence: number;
  description: string;
  symptoms: string[];
  causes: string[];
  organicTreatments: string[];
  chemicalTreatments: string[];
  prevention: string[];
}

export enum AnalysisState {
  IDLE = 'IDLE',
  UPLOADING = 'UPLOADING',
  ANALYZING = 'ANALYZING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
