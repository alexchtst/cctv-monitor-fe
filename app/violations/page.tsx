import { getBackendSnapshot, newestEvents } from "../api-client";
import { AppShell, Icon } from "../ui";

export default async function ViolationsPage() {
  const { events } = await getBackendSnapshot();
  const visibleEvents = newestEvents(events, 100);

  return (
    <AppShell active="Violation Logs" searchPlaceholder="Cari log pelanggaran...">
      <div className="screen-heading">
        <div>
          <p className="breadcrumb-lite">Violation Logs</p>
          <h1>Log Pelanggaran K3</h1>
          <span>Daftar output prediksi AI dan status notifikasi dari backend.</span>
        </div>
        <button className="brown-button"><Icon name="download" /> EXPORT CSV</button>
      </div>

      <div className="log-filters panel">
        <button className="active">Semua</button>
        <button>High Severity</button>
        <button>Queued Notification</button>
        <button>Muted</button>
      </div>

      <section className="panel table-panel">
        <div className="table-header">
          <h2>SEMUA PELANGGARAN</h2>
          <span className="table-count">{events.length} records</span>
        </div>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>WAKTU</th>
                <th>KAMERA</th>
                <th>JENIS</th>
                <th>CONFIDENCE</th>
                <th>NOTIFIKASI</th>
                <th>AKSI</th>
              </tr>
            </thead>
            <tbody>
              {visibleEvents.map((event) => (
                <tr key={event.id}>
                  <td>{event.time}</td>
                  <td>
                    <strong>{event.camera}</strong>
                    <small className="cell-subtitle">{event.cameraId}</small>
                  </td>
                  <td><span className="tag danger">{event.type}</span></td>
                  <td>{event.confidence}%</td>
                  <td><span className={`notify-pill ${event.notification}`}>{event.notification}</span></td>
                  <td><button className="icon-button"><Icon name="image" /></button></td>
                </tr>
              ))}
              {visibleEvents.length === 0 && (
                <tr>
                  <td colSpan={6}>Belum ada log pelanggaran dari backend.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </AppShell>
  );
}
