export type CameraStream = {
  id: string;
  name: string;
  location: string;
  hikonekChannelId: string;
  status: "online" | "degraded" | "offline";
  streamUrl: string;
  activeDetections: string[];
  confidence: number;
};

export type PredictionEvent = {
  id: string;
  time: string;
  cameraId: string;
  camera: string;
  type: "NO HELMET" | "NO MASK" | "SMOKING" | "RESTRICTED AREA";
  confidence: number;
  severity: "high" | "medium" | "low";
  notification: "queued" | "sent" | "muted";
};

export const cameraStreams: CameraStream[] = [
  { id: "cam-001", name: "Gate 1 - Utama", location: "Main Entrance", hikonekChannelId: "HIK-GATE-001", status: "online", streamUrl: "dummy://hikonek/gate-1", activeDetections: ["NO HELMET"], confidence: 96 },
  { id: "cam-002", name: "Loading Dock B", location: "Warehouse Dock", hikonekChannelId: "HIK-DOCK-002", status: "online", streamUrl: "dummy://hikonek/loading-dock-b", activeDetections: ["SMOKING"], confidence: 91 },
  { id: "cam-003", name: "Area Produksi 2", location: "Production Floor", hikonekChannelId: "HIK-PROD-003", status: "online", streamUrl: "dummy://hikonek/production-2", activeDetections: ["NO MASK"], confidence: 88 },
  { id: "cam-004", name: "Warehouse A", location: "Storage Zone", hikonekChannelId: "HIK-WH-A-004", status: "degraded", streamUrl: "dummy://hikonek/warehouse-a", activeDetections: [], confidence: 72 },
  { id: "cam-005", name: "Gate 4", location: "Back Gate", hikonekChannelId: "HIK-GATE-004", status: "offline", streamUrl: "dummy://hikonek/gate-4", activeDetections: [], confidence: 0 },
  { id: "cam-006", name: "Packaging Line", location: "Line C", hikonekChannelId: "HIK-PACK-006", status: "online", streamUrl: "dummy://hikonek/packaging-line", activeDetections: ["RESTRICTED AREA"], confidence: 84 },
];

export const predictionEvents: PredictionEvent[] = [
  { id: "evt-1045", time: "10:45 AM", cameraId: "cam-001", camera: "Gate 1 - Utama", type: "NO HELMET", confidence: 96, severity: "high", notification: "sent" },
  { id: "evt-1032", time: "10:32 AM", cameraId: "cam-002", camera: "Loading Dock B", type: "SMOKING", confidence: 91, severity: "medium", notification: "queued" },
  { id: "evt-1015", time: "10:15 AM", cameraId: "cam-003", camera: "Area Produksi 2", type: "NO MASK", confidence: 88, severity: "high", notification: "sent" },
  { id: "evt-0958", time: "09:58 AM", cameraId: "cam-004", camera: "Warehouse A", type: "NO HELMET", confidence: 82, severity: "high", notification: "sent" },
  { id: "evt-0944", time: "09:44 AM", cameraId: "cam-006", camera: "Packaging Line", type: "RESTRICTED AREA", confidence: 84, severity: "medium", notification: "muted" },
];

export const weeklyTrend = [
  { label: "SEN", value: 52 },
  { label: "SEL", value: 38 },
  { label: "RAB", value: 67 },
  { label: "KAM", value: 80 },
  { label: "JUM", value: 86 },
  { label: "SAB", value: 24 },
  { label: "MIN", value: 20 },
];

export const categoryBreakdown = [
  { label: "Tanpa APD", value: 45, color: "navy" },
  { label: "Tanpa Masker", value: 30, color: "tan" },
  { label: "Merokok", value: 25, color: "red" },
];
