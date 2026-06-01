export type CameraStream = {
  id: string;
  name: string;
  location: string;
  hikonekChannelId: string;
  status: "online" | "degraded" | "offline";
  streamUrl?: string;
  activeDetections: ViolationType[];
  confidence: number;
};

export type ViolationType = "NO HELMET" | "NO MASK" | "SMOKING" | "RESTRICTED AREA";

export type PredictionEvent = {
  id: string;
  time: string;
  timestamp?: string;
  cameraId: string;
  camera: string;
  type: ViolationType;
  confidence: number;
  severity: "high" | "medium" | "low";
  notification: "queued" | "sent" | "muted";
  analysis?: string | null;
};

export type HealthStatus = {
  ok: boolean;
  cameras: number;
  activeLoops: number;
  aiEngineUrl: string;
  emailEnabled: boolean;
};

export type BackendSnapshot = {
  cameras: CameraStream[];
  events: PredictionEvent[];
  health: HealthStatus | null;
  online: boolean;
};

const DEFAULT_BACKEND_URL = "http://localhost:8010";

export function backendBaseUrl() {
  return (
    process.env.HIKONEK_STREAM_URL ||
    process.env.NEXT_PUBLIC_HIKONEK_STREAM_URL ||
    DEFAULT_BACKEND_URL
  ).replace(/\/$/, "");
}

export function publicBackendBaseUrl() {
  return (process.env.NEXT_PUBLIC_HIKONEK_STREAM_URL || DEFAULT_BACKEND_URL).replace(/\/$/, "");
}

export function backendWebSocketUrl() {
  return `${publicBackendBaseUrl().replace(/^http/, "ws")}/ws/predictions`;
}

async function getJson<T>(path: string): Promise<T> {
  const response = await fetch(`${backendBaseUrl()}${path}`, {
    cache: "no-store",
    signal: AbortSignal.timeout(3500),
  });

  if (!response.ok) {
    throw new Error(`Backend ${path} returned ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function getBackendSnapshot(): Promise<BackendSnapshot> {
  try {
    const [cameras, events, health] = await Promise.all([
      getJson<CameraStream[]>("/cameras"),
      getJson<PredictionEvent[]>("/events"),
      getJson<HealthStatus>("/health"),
    ]);

    return { cameras, events, health, online: true };
  } catch {
    return { cameras: [], events: [], health: null, online: false };
  }
}

export function streamUrl(cameraId: string) {
  return `${publicBackendBaseUrl()}/stream/${encodeURIComponent(cameraId)}.mjpg`;
}

export function newestEvents(events: PredictionEvent[], limit = 5) {
  return [...events]
    .sort((a, b) => new Date(b.timestamp || 0).getTime() - new Date(a.timestamp || 0).getTime())
    .slice(0, limit);
}

export function categoryBreakdown(events: PredictionEvent[]) {
  const labels: Record<ViolationType, string> = {
    "NO HELMET": "Tanpa APD",
    "NO MASK": "Tanpa Masker",
    SMOKING: "Merokok",
    "RESTRICTED AREA": "Area Terbatas",
  };
  const colors: Record<ViolationType, string> = {
    "NO HELMET": "navy",
    "NO MASK": "tan",
    SMOKING: "red",
    "RESTRICTED AREA": "amber",
  };
  const total = Math.max(events.length, 1);
  const counts = events.reduce<Record<ViolationType, number>>(
    (acc, event) => {
      acc[event.type] += 1;
      return acc;
    },
    { "NO HELMET": 0, "NO MASK": 0, SMOKING: 0, "RESTRICTED AREA": 0 },
  );

  return Object.entries(counts)
    .filter(([, count]) => count > 0)
    .map(([type, count]) => ({
      label: labels[type as ViolationType],
      value: Math.round((count / total) * 100),
      color: colors[type as ViolationType],
    }));
}

export function weeklyTrend(events: PredictionEvent[]) {
  const labels = ["SEN", "SEL", "RAB", "KAM", "JUM", "SAB", "MIN"];
  const counts = Array.from({ length: 7 }, () => 0);

  for (const event of events) {
    if (!event.timestamp) continue;
    const date = new Date(event.timestamp);
    if (Number.isNaN(date.getTime())) continue;
    const index = (date.getDay() + 6) % 7;
    counts[index] += 1;
  }

  const max = Math.max(...counts, 1);
  return labels.map((label, index) => ({
    label,
    value: counts[index] === 0 ? 4 : Math.round((counts[index] / max) * 100),
  }));
}
