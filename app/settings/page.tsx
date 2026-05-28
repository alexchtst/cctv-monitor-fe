import { AppShell, Icon } from "../ui";

const template = `Subjek: [URGENT] Pelanggaran K3 Terdeteksi - [Jenis_Pelanggaran]

Halo Tim Safety,

Telah terdeteksi pelanggaran K3 pada:
Waktu: [Waktu]
Lokasi: [Lokasi]
Jenis: [Jenis_Pelanggaran]

Mohon segera lakukan pengecekan pada sistem.`;

export default function SettingsPage() {
  return (
    <AppShell active="Settings" searchPlaceholder="Search parameters...">
      <div className="settings-page">
        <nav className="breadcrumb">
          <span>Pengaturan</span>
          <Icon name="chevron" />
          <strong>Notifikasi & SMTP</strong>
        </nav>

        <header className="settings-heading">
          <h1>Pengaturan Notifikasi & SMTP</h1>
          <p>Konfigurasikan jalur komunikasi otomatis untuk deteksi insiden real-time.</p>
        </header>

        <section className="settings-card">
          <div className="settings-card-head">
            <h2>Konfigurasi Server SMTP</h2>
            <p>Atur detail server email untuk pengiriman notifikasi otomatis.</p>
          </div>
          <div className="settings-card-body">
            <div className="form-grid">
              <label>
                <span>SMTP HOST</span>
                <input defaultValue="smtp.gmail.com" />
              </label>
              <label>
                <span>PORT</span>
                <input defaultValue="587" />
              </label>
              <label>
                <span>EMAIL PENGIRIM / USERNAME</span>
                <input defaultValue="admin@k3vigilance.ai" />
              </label>
              <label>
                <span>PASSWORD</span>
                <input defaultValue="••••••••••••" />
              </label>
            </div>
            <div className="form-actions">
              <button className="outline-button"><Icon name="mail" /> Tes Koneksi Email</button>
            </div>
          </div>
        </section>

        <section className="settings-card">
          <div className="settings-card-head">
            <h2>Penerima & Template</h2>
            <p>Kelola daftar distribusi dan format konten notifikasi.</p>
          </div>
          <div className="settings-card-body">
            <div className="field-stack">
              <span className="label">DAFTAR EMAIL ADMIN</span>
              <div className="email-input-row">
                <input placeholder="Tambah email baru..." />
                <button><Icon name="plus" /></button>
              </div>
              <div className="chips">
                <span>manager@site.com <Icon name="x" /></span>
                <span>safety.officer@site.com <Icon name="x" /></span>
              </div>
            </div>

            <div className="field-stack">
              <span className="label">TEMPLATE EMAIL ALERT K3</span>
              <div className="textarea-wrap">
                <textarea defaultValue={template} />
                <button><Icon name="copy" /></button>
              </div>
              <div className="note">
                <Icon name="info" />
                <span>
                  <strong>Catatan:</strong> Gunakan tag dinamis berikut:{" "}
                  <code>[Waktu]</code>, <code>[Lokasi]</code>, <code>[Jenis_Pelanggaran]</code>.
                </span>
              </div>
            </div>
          </div>
        </section>

        <div className="save-row">
          <button className="save-button"><Icon name="save" /> SIMPAN PENGATURAN</button>
        </div>
      </div>
    </AppShell>
  );
}
