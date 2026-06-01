import {
  categoryBreakdown,
  getBackendSnapshot,
  newestEvents,
  weeklyTrend,
} from "../api-client";
import { AppShell } from "../ui";

export default async function AnalyticsPage() {
  const { events } = await getBackendSnapshot();
  const latestEvents = newestEvents(events, 8);
  const breakdown = categoryBreakdown(events);
  const trend = weeklyTrend(events);
  const averageConfidence = events.length
    ? Math.round(events.reduce((sum, event) => sum + event.confidence, 0) / events.length)
    : 0;
  const sentNotifications = events.filter((event) => event.notification === "sent").length;
  const highSeverity = events.filter((event) => event.severity === "high").length;

  return (
    <AppShell active="Analytics" searchPlaceholder="Cari metrik atau kamera...">
      <div className="screen-heading">
        <div>
          <p className="breadcrumb-lite">Analytics</p>
          <h1>Analitik Kepatuhan K3</h1>
          <span>Metrik langsung dari event prediksi hikonek-stream.</span>
        </div>
        <div className="segmented">
          <button>PEKAN INI</button>
          <button>BULAN INI</button>
        </div>
      </div>

      <div className="analytics-kpis">
        <section className="kpi-card">
          <p className="eyebrow">RATA-RATA CONFIDENCE</p>
          <div className="kpi-value">{averageConfidence}<span>%</span></div>
          <p className="micro">Dari {events.length} prediksi terbaru</p>
        </section>
        <section className="kpi-card">
          <p className="eyebrow">NOTIFIKASI TERKIRIM</p>
          <div className="kpi-value">{sentNotifications}</div>
          <p className="micro">Email alert otomatis backend</p>
        </section>
        <section className="kpi-card">
          <p className="eyebrow">FALSE POSITIVE REVIEW</p>
          <div className="kpi-value danger">{highSeverity}</div>
          <p className="micro">Butuh validasi safety officer</p>
        </section>
      </div>

      <div className="charts-grid">
        <section className="panel chart-panel">
          <div className="panel-title-row">
            <h2>TREN PREDIKSI AI</h2>
          </div>
          <div className="bar-chart tall">
            {trend.map((day, index) => (
              <div className="bar-column" key={day.label}>
                <span className={index === 4 ? "bar active" : "bar"} style={{ height: `${day.value}%` }} />
                <small>{day.label}</small>
              </div>
            ))}
          </div>
        </section>
        <section className="panel chart-panel">
          <div className="panel-title-row">
            <h2>DISTRIBUSI KATEGORI</h2>
          </div>
          <div className="donut-layout">
            <div className="donut">
              <div>
                <span>TOTAL</span>
                <strong>{events.length}</strong>
              </div>
            </div>
            <div className="legend-list">
              {breakdown.length > 0 ? breakdown.map((item) => (
                <div key={item.label}><i className={item.color} />{item.label}<strong>{item.value}%</strong></div>
              )) : <div><i className="navy" />Belum ada event<strong>0%</strong></div>}
            </div>
          </div>
        </section>
      </div>

      <section className="panel model-panel">
        <div className="table-header">
          <h2>MODEL PERFORMANCE</h2>
        </div>
        <div className="model-grid">
          {["Helmet Detector", "Mask Detector", "Smoke Classifier", "Restricted Area"].map((model, index) => (
            <div className="model-row" key={model}>
              <span>{model}</span>
              <div><i style={{ width: `${[averageConfidence, averageConfidence, averageConfidence, averageConfidence][index]}%` }} /></div>
              <strong>{averageConfidence}%</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="panel table-panel">
        <div className="table-header">
          <h2>SAMPEL PREDIKSI TERBARU</h2>
        </div>
        <div className="table-scroll">
          <table>
            <tbody>
              {latestEvents.map((event) => (
                <tr key={event.id}>
                  <td>{event.time}</td>
                  <td><strong>{event.camera}</strong></td>
                  <td><span className="tag danger">{event.type}</span></td>
                  <td>{event.confidence}%</td>
                </tr>
              ))}
              {latestEvents.length === 0 && (
                <tr>
                  <td colSpan={4}>Belum ada sampel prediksi dari backend.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </AppShell>
  );
}
