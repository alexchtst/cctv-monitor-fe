import { categoryBreakdown, predictionEvents, weeklyTrend } from "../dummy-data";
import { AppShell } from "../ui";

export default function AnalyticsPage() {
  return (
    <AppShell active="Analytics" searchPlaceholder="Cari metrik atau kamera...">
      <div className="screen-heading">
        <div>
          <p className="breadcrumb-lite">Analytics</p>
          <h1>Analitik Kepatuhan K3</h1>
          <span>Dummy metrics untuk validasi UI sebelum data AI engine masuk.</span>
        </div>
        <div className="segmented">
          <button>PEKAN INI</button>
          <button>BULAN INI</button>
        </div>
      </div>

      <div className="analytics-kpis">
        <section className="kpi-card">
          <p className="eyebrow">RATA-RATA CONFIDENCE</p>
          <div className="kpi-value">91<span>%</span></div>
          <p className="micro">Dari 128 prediksi hari ini</p>
        </section>
        <section className="kpi-card">
          <p className="eyebrow">NOTIFIKASI TERKIRIM</p>
          <div className="kpi-value">84</div>
          <p className="micro">Email alert otomatis dummy</p>
        </section>
        <section className="kpi-card">
          <p className="eyebrow">FALSE POSITIVE REVIEW</p>
          <div className="kpi-value danger">7</div>
          <p className="micro">Butuh validasi safety officer</p>
        </section>
      </div>

      <div className="charts-grid">
        <section className="panel chart-panel">
          <div className="panel-title-row">
            <h2>TREN PREDIKSI AI</h2>
          </div>
          <div className="bar-chart tall">
            {weeklyTrend.map((day, index) => (
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
                <strong>128</strong>
              </div>
            </div>
            <div className="legend-list">
              {categoryBreakdown.map((item) => (
                <div key={item.label}><i className={item.color} />{item.label}<strong>{item.value}%</strong></div>
              ))}
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
              <div><i style={{ width: `${[96, 88, 91, 84][index]}%` }} /></div>
              <strong>{[96, 88, 91, 84][index]}%</strong>
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
              {predictionEvents.map((event) => (
                <tr key={event.id}>
                  <td>{event.time}</td>
                  <td><strong>{event.camera}</strong></td>
                  <td><span className="tag danger">{event.type}</span></td>
                  <td>{event.confidence}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AppShell>
  );
}
