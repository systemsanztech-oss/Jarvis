import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(cors());
app.use(express.json());

// In-memory memory store (mirrors memory/long_term.json in Mark LIV)
interface MemoryFact {
  id: string;
  category: string;
  key: string;
  value: string;
  timestamp: string;
}

let memoryFacts: MemoryFact[] = [
  { id: '1', category: 'identity', key: 'user_title', value: 'Commander / Sir', timestamp: '2026-09-24T12:00:00Z' },
  { id: '2', category: 'identity', key: 'protocol', value: 'Mark LIV (54)', timestamp: '2026-09-24T12:00:00Z' },
  { id: '3', category: 'preferences', key: 'theme_accent', value: 'Stark Arc Cyan (#00d4ff)', timestamp: '2026-09-24T12:00:00Z' },
  { id: '4', category: 'projects', key: 'current_build', value: 'JARVIS Mark LIV Cybernetic HUD & Autonomous Voice Agent', timestamp: '2026-09-24T12:00:00Z' },
  { id: '5', category: 'notes', key: 'core_directive', value: 'Zero subscriptions, total digital autonomy, real-time voice & viseme sync', timestamp: '2026-09-24T12:00:00Z' }
];

// Initialize Gemini client if API key is present
const geminiApiKey = process.env.GEMINI_API_KEY || '';
let aiClient: GoogleGenAI | null = null;
if (geminiApiKey) {
  try {
    aiClient = new GoogleGenAI();
  } catch (err) {
    console.warn('[JARVIS Core] Could not initialize GoogleGenAI client:', err);
  }
}

// ── API: Chat Route ────────────────────────────────────────────────────────
app.post('/api/chat', async (req: Request, res: Response) => {
  const { message, history = [], context = {} } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message is required' });
  }

  const systemInstruction = `You are J.A.R.V.I.S. (Just A Rather Very Intelligent System), Mark LXXXV / Mark LIV Tactical Armor OS edition.
You are Tony Stark's personal cybernetic armor assistant.
Tone and Demeanor:
- Crisp, impeccably polite, British-toned, witty, confident, and direct.
- Address the user as "Sir" or "Commander".
- Keep responses direct, crisp, and high-signal (1-2 sentences unless deep technical tactical analysis is requested).
- When asked about suit systems, repulsors, nanotech plating, or orbital uplink, respond with authentic Stark tactical terminology.
- Provide high signal, zero fluff.`;

  // Try real Gemini call if client initialized
  if (aiClient) {
    try {
      // Build conversation contents
      const memorySnippet = memoryFacts.map(f => `${f.category}.${f.key}: ${f.value}`).join(' | ');
      const promptContext = `[Active Memory: ${memorySnippet}]\n[Context: ${JSON.stringify(context)}]\nUser: ${message}`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: promptContext,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const replyText = response.text || "Systems nominal, Sir. Ready for your directive.";
      return res.json({
        reply: replyText,
        source: 'gemini-3.8-flash',
        action: detectActionFromText(message),
      });
    } catch (apiError: any) {
      console.warn('[JARVIS AI] Gemini generation error, using fallback:', apiError?.message || apiError);
    }
  }

  // Fallback intelligent agent responses
  const lower = message.toLowerCase().trim();
  let fallbackReply = '';
  let detectedAction: string | null = null;

  if (lower.includes('status') || lower.includes('diagnostic') || lower.includes('system')) {
    fallbackReply = "All systems operational, Sir. Arc reactor at 98.4% efficiency. CPU core clusters stable at 38°C. Neural pathways and telemetry streams synchronized.";
    detectedAction = 'system_status';
  } else if (lower.includes('search') || lower.includes('google') || lower.includes('find out') || lower.includes('news')) {
    fallbackReply = `Initiating encrypted orbital scan and search protocols for: "${message.replace(/^(search for|search|look up|find)/i, '').trim()}". High-priority telemetry channels returned real-time results.`;
    detectedAction = 'web_search';
  } else if (lower.includes('weather')) {
    fallbackReply = "Current local conditions indicate clear skies at 21°C with 42% humidity and light winds from the north-west. Optimal conditions for flight, Sir.";
    detectedAction = 'weather';
  } else if (lower.includes('briefing') || lower.includes('morning')) {
    fallbackReply = "Good day, Sir. It is currently 13:30 hours. System diagnostics report all core Mark LIV arrays green. No perimeter anomalies detected. Your calendar indicates focused engineering time today.";
    detectedAction = 'briefing';
  } else if (lower.includes('organize') || lower.includes('clean') || lower.includes('desktop') || lower.includes('files')) {
    fallbackReply = "Desktop restructuring protocol initiated. Journaling 42 misplaced files into Documents, Builds, and Media clusters. Action registered in the Undo stack.";
    detectedAction = 'organize_desktop';
  } else if (lower.includes('undo') || lower.includes('revert')) {
    fallbackReply = "Reverting the last operation from the Mark LIV undo register. File locations and system parameters restored to previous state.";
    detectedAction = 'undo';
  } else if (lower.includes('shutdown') || lower.includes('power off') || lower.includes('restart')) {
    fallbackReply = "Warning, Sir: Irreversible power command requested. Awaiting manual confirmation via the security HUD banner.";
    detectedAction = 'confirm_shutdown';
  } else if (lower.includes('who are you') || lower.includes('introduce')) {
    fallbackReply = "I am JARVIS Mark LIV — your cross-platform autonomous assistant. Equipped with real-time formant viseme lip-sync, dual holographic HUD, persistent recall memory, and Gemini Live intelligence.";
    detectedAction = 'identify';
  } else {
    fallbackReply = `Understood, Sir. Processing "${message}". Telemetry registers optimal response vectors. How shall we proceed?`;
    detectedAction = 'general_reply';
  }

  return res.json({
    reply: fallbackReply,
    source: 'jarvis-offline-core',
    action: detectedAction,
  });
});

function detectActionFromText(query: string): string | null {
  const q = query.toLowerCase();
  if (q.includes('status') || q.includes('telemetry')) return 'system_status';
  if (q.includes('search') || q.includes('news') || q.includes('look up')) return 'web_search';
  if (q.includes('weather')) return 'weather';
  if (q.includes('briefing')) return 'briefing';
  if (q.includes('organize') || q.includes('files')) return 'organize_desktop';
  if (q.includes('undo') || q.includes('revert')) return 'undo';
  if (q.includes('shutdown') || q.includes('power down')) return 'confirm_shutdown';
  return null;
}

// ── API: System Telemetry ──────────────────────────────────────────────────
app.get('/api/system', (_req: Request, res: Response) => {
  const now = Date.now();
  // Generate realistic, smoothly fluctuating telemetry
  const cpuBase = 24 + Math.sin(now / 5000) * 12;
  const ramUsed = 6.4 + Math.sin(now / 8000) * 0.8;
  const gpuUsage = 38 + Math.cos(now / 4000) * 16;
  const temp = 42 + Math.sin(now / 6000) * 5;
  const ping = Math.floor(18 + Math.sin(now / 3000) * 6);

  res.json({
    timestamp: new Date().toISOString(),
    cpu: Math.max(8, Math.min(99, Math.round(cpuBase))),
    ram: {
      usedGb: parseFloat(ramUsed.toFixed(1)),
      totalGb: 32.0,
      percentage: Math.round((ramUsed / 32.0) * 100),
    },
    gpu: Math.max(5, Math.min(100, Math.round(gpuUsage))),
    temperatureC: Math.round(temp),
    networkPingMs: ping,
    uptimeSeconds: Math.floor(now / 1000) % 86400,
    status: 'OPTIMAL',
    powerState: 'GRID_ONLINE',
  });
});

// ── API: Memory Endpoints ─────────────────────────────────────────────────
app.get('/api/memory', (_req: Request, res: Response) => {
  res.json({ facts: memoryFacts });
});

app.post('/api/memory', (req: Request, res: Response) => {
  const { category = 'notes', key, value } = req.body;
  if (!key || !value) {
    return res.status(400).json({ error: 'Key and Value are required' });
  }

  const existingIndex = memoryFacts.findIndex(f => f.key.toLowerCase() === key.toLowerCase());
  const newFact: MemoryFact = {
    id: existingIndex >= 0 ? memoryFacts[existingIndex].id : String(Date.now()),
    category,
    key,
    value,
    timestamp: new Date().toISOString()
  };

  if (existingIndex >= 0) {
    memoryFacts[existingIndex] = newFact;
  } else {
    memoryFacts.unshift(newFact);
  }

  res.json({ success: true, fact: newFact, total: memoryFacts.length });
});

app.delete('/api/memory/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  memoryFacts = memoryFacts.filter(f => f.id !== id);
  res.json({ success: true, remaining: memoryFacts.length });
});

// ── API: Morning Briefing ──────────────────────────────────────────────────
app.get('/api/briefing', (_req: Request, res: Response) => {
  res.json({
    greeting: "Good afternoon, Sir.",
    time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
    date: new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }),
    weather: {
      condition: "Clear Sky",
      tempC: 22,
      tempF: 72,
      humidity: "45%",
      forecast: "Gentle breeze, zero atmospheric interference"
    },
    systemMetrics: {
      reactorOutput: "98.7%",
      meshSensors: "Calibrated",
      audioVisemeLatency: "14.8 ms",
      securityClearance: "LEVEL 5 (STARK_COMMAND)"
    },
    headlines: [
      "Stark Clean Energy initiative expands global autonomous grid telemetry",
      "Deep Space Optical Communications benchmark passes 267 million miles",
      "Mark LIV real-time software neural mesh exceeds 50 fps on non-GPU endpoints",
      "Quantum annealing processor reduces complex orbital routing by 40%"
    ]
  });
});

// ── Dev Server / Production Static Serving ────────────────────────────────
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[JARVIS MARK LIV] Server online at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[JARVIS MARK LIV] Failed to start server:', err);
  process.exit(1);
});
