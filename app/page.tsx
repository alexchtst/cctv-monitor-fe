import Link from "next/link";
import { AppShell, Icon, StatusFeed } from "./ui";

const violations = [
  ["10:45 AM", "Gate 1 - Utama", "NO HELMET", "danger"],
  ["10:32 AM", "Loading Dock B", "SMOKING", "neutral"],
  ["10:15 AM", "Area Produksi 2", "NO MASK", "danger"],
  ["09:58 AM", "Warehouse A", "NO HELMET", "danger"],
];

export default function DashboardPage() {
  return (
    <AppShell active="Dashboard" searchPlaceholder="Cari Log atau Kamera...">
      <div className="dashboard-grid">
        <section className="kpi-card kpi-compliance">
          <div>
            <p className="eyebrow">TINGKAT<br />KEPATUHAN K3</p>
            <div className="kpi-value">
              94<span>%</span>
            </div>
            <p className="micro">↗ Target: 98% Bulan ini</p>
          </div>
          <div className="shield-mark">
            <Icon name="shield" />
          </div>
        </section>

        <section className="kpi-card">
          <div className="kpi-split">
            <div>
              <p className="eyebrow">TOTAL<br />PELANGGARAN<br />HARI INI</p>
              <div className="kpi-value danger">128</div>
            </div>
            <span className="change-badge">+12% DARI<br />KEMARIN</span>
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
              18 <span>/ 20</span>
            </div>
            <span className="online-pill"><i /> ONLINE</span>
          </div>
          <p className="micro">Downtime terdeteksi di: Warehouse B, Gate 4</p>
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
                <strong>128</strong>
              </div>
            </div>
            <div className="legend-list">
              <div><i className="navy" />Tanpa APD <strong>45%</strong></div>
              <div><i className="tan" />Tanpa Masker <strong>30%</strong></div>
              <div><i className="red" />Merokok <strong>25%</strong></div>
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
            {[52, 38, 67, 80, 86, 24, 20].map((height, index) => (
              <div className="bar-column" key={index}>
                <span
                  className={index === 4 ? "bar active" : "bar"}
                  style={{ height: `${height}%` }}
                />
                <small>{["SEN", "SEL", "RAB", "KAM", "JUM", "SAB", "MIN"][index]}</small>
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
              {violations.map(([time, camera, type, tone]) => (
                <tr key={`${time}-${camera}`}>
                  <td>{time}</td>
                  <td><strong>{camera}</strong></td>
                  <td><span className={`tag ${tone}`}>{type}</span></td>
                  <td><button className="icon-button"><Icon name="image" /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="table-footer">
          <span>Menampilkan 4 dari 128 pelanggaran hari ini</span>
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
