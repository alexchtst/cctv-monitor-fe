import { getBackendSnapshot } from "../api-client";
import { AppShell } from "../ui";
import { LiveMonitor } from "./live-monitor";

export default async function LiveViewPage() {
  const snapshot = await getBackendSnapshot();

  return (
    <AppShell active="Live View" searchPlaceholder="Cari kamera atau area...">
      <LiveMonitor initialSnapshot={snapshot} />
    </AppShell>
  );
}
