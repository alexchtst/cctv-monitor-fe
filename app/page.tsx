import Link from "next/link";
import {
  categoryBreakdown,
  getBackendSnapshot,
  newestEvents,
  weeklyTrend,
} from "./api-client";
import { AppShell, Icon, StatusFeed } from "./ui";

export default async function DashboardPage() {
  const { cameras, events, health, online } = await getBackendSnapshot();
  const activeCameras = cameras.filter((camera) => camera.status !== "offline").length;
  const latestEvents = newestEvents(events, 4);
  const breakdown = categoryBreakdown(events);
  const trend = weeklyTrend(events);
  const averageConfidence = events.length
    ? Math.round(events.reduce((sum, event) => sum + event.confidence, 0) / events.length)
    : 0;
  const compliance = Math.max(0, 100 - Math.min(events.length, 100));

  return (
    <AppShell active="Dashboard" searchPlaceholder="Cari Log atau Kamera...">
      <div className="dashboard-grid">
        <section className="kpi-card kpi-compliance">
          <div>
            <p className="eyebrow">TINGKAT<br />KEPATUHAN K3</p>
            <div className="kpi-value">
              {compliance}<span>%</span>
            </div>
            <p className="micro">{online ? "Target: 98% bulan ini" : "Backend belum terhubung"}</p>
          </div>
          <div className="shield-mark">
            <Icon name="shield" />
          </div>
        </section>

        <section className="kpi-card">
          <div className="kpi-split">
            <div>
              <p className="eyebrow">TOTAL<br />PELANGGARAN<br />HARI INI</p>
              <div className="kpi-value danger">{events.length}</div>
            </div>
            <span className="change-badge">{averageConfidence}% AVG<br />CONFIDENCE</span>
          </div>
          <div className="risk-bars">
            <span />
            <span />
            <span />
          </div>
        </section>

        <section className="kpi-card">
          <p className="eyebrow">KAMERA AKTIF</p>
          <div className="camera-row">
            <div className="kpi-value">
              {activeCameras} <span>/ {cameras.length}</span>
            </div>
            <span className="online-pill"><i /> {online ? "ONLINE" : "OFFLINE"}</span>
          </div>
          <p className="micro">
            {health ? `${health.activeLoops} stream loop aktif, email ${health.emailEnabled ? "aktif" : "nonaktif"}` : "Jalankan hikonek-stream di port 8010"}
          </p>
        </section>
      </div>

      <div className="charts-grid">
        <section className="panel chart-panel">
          <div className="panel-title-row">
            <h2>KATEGORI PELANGGARAN</h2>
            <span className="dots">•••</span>
          </div>
          <div className="donut-layout">
            <div className="donut" aria-label="Total pelanggaran 128">
              <div>
                <span>TOTAL</span>
                <strong>{events.length}</strong>
              </div>
            </div>
            <div className="legend-list">
              {breakdown.length > 0 ? (
                breakdown.map((item) => (
                  <div key={item.label}><i className={item.color} />{item.label}<strong>{item.value}%</strong></div>
                ))
              ) : (
                <div><i className="navy" />Belum ada event <strong>0%</strong></div>
              )}
            </div>
          </div>
        </section>

        <section className="panel chart-panel">
          <div className="panel-title-row">
            <h2>TREN PELANGGARAN<br />MINGGUAN</h2>
            <div className="segmented">
              <button>PEKAN INI</button>
              <button>PEKAN LALU</button>
            </div>
          </div>
          <div className="bar-chart" aria-label="Tren pelanggaran mingguan">
            {trend.map((day, index) => (
              <div className="bar-column" key={index}>
                <span
                  className={index === 4 ? "bar active" : "bar"}
                  style={{ height: `${day.value}%` }}
                />
                <small>{day.label}</small>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="panel table-panel">
        <div className="table-header">
          <h2>PELANGGARAN TERBARU</h2>
          <button className="brown-button"><Icon name="download" /> UNDUH LAPORAN</button>
        </div>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>WAKTU</th>
                <th>KAMERA</th>
                <th>JENIS PELANGGARAN</th>
                <th>BUKTI FOTO</th>
              </tr>
            </thead>
            <tbody>
              {latestEvents.map((event) => (
                <tr key={event.id}>
                  <td>{event.time}</td>
                  <td><strong>{event.camera}</strong></td>
                  <td><span className={`tag ${event.severity === "high" ? "danger" : "neutral"}`}>{event.type}</span></td>
                  <td><button className="icon-button"><Icon name="image" /></button></td>
                </tr>
              ))}
              {latestEvents.length === 0 && (
                <tr>
                  <td colSpan={4}>Belum ada pelanggaran dari backend.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="table-footer">
          <span>Menampilkan {latestEvents.length} dari {events.length} pelanggaran</span>
          <div>
            <button disabled>Previous</button>
            <button>Next</button>
          </div>
        </div>
      </section>
      <StatusFeed />
      <Link className="hidden-settings-link" href="/settings">Settings</Link>
    </AppShell>
  );
}
