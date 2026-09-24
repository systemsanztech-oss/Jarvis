export type AssistantState = 'IDLE' | 'LISTENING' | 'THINKING' | 'SPEAKING' | 'SLEEPING';

export type HudMode = 'AVATAR' | 'REACTOR';

export interface SystemStats {
  timestamp: string;
  cpu: number;
  ram: {
    usedGb: number;
    totalGb: number;
    percentage: number;
  };
  gpu: number;
  temperatureC: number;
  networkPingMs: number;
  uptimeSeconds: number;
  status: string;
  powerState: string;
}

export interface MemoryFact {
  id: string;
  category: string;
  key: string;
  value: string;
  timestamp: string;
}

export interface Message {
  id: string;
  sender: 'user' | 'jarvis' | 'system';
  text: string;
  timestamp: string;
  action?: string | null;
  payload?: any;
}

export interface BriefingData {
  greeting: string;
  time: string;
  date: string;
  weather: {
    condition: string;
    tempC: number;
    tempF: number;
    humidity: string;
    forecast: string;
  };
  systemMetrics: {
    reactorOutput: string;
    meshSensors: string;
    audioVisemeLatency: string;
    securityClearance: string;
  };
  headlines: string[];
}

export interface VisemeFrame {
  level: number;     // 0.0 - 1.0 loudness
  openness: number;  // 0.0 - 1.0 jaw drop (formant F1)
  width: number;     // -1.0 to 1.0 pursed to wide spread (formant F2)
}

export interface ThemeColors {
  primary: string;       // main glowing teal/accent
  primaryDim: string;
  primaryGhost: string;
  bgDark: string;
  panelBg: string;
  borderDim: string;
  borderBright: string;
  textBright: string;
  textDim: string;
  warning: string;
  danger: string;
  success: string;
}
