import { predictionEvents } from "../dummy-data";
import { AppShell, Icon } from "../ui";

export default function ViolationsPage() {
  return (
    <AppShell active="Violation Logs" searchPlaceholder="Cari log pelanggaran...">
      <div className="screen-heading">
        <div>
          <p className="breadcrumb-lite">Violation Logs</p>
          <h1>Log Pelanggaran K3</h1>
          <span>Daftar dummy dari output prediksi AI dan status notifikasi.</span>
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
          <span className="table-count">128 records</span>
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
              {predictionEvents.map((event) => (
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
            </tbody>
          </table>
        </div>
      </section>
    </AppShell>
  );
}
