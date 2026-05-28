import { cameraStreams, predictionEvents } from "../dummy-data";
import { AppShell, Icon, StatusFeed } from "../ui";

export default function LiveViewPage() {
  const primary = cameraStreams[0];

  return (
    <AppShell active="Live View" searchPlaceholder="Cari kamera atau area...">
      <div className="screen-heading">
        <div>
          <p className="breadcrumb-lite">Live View</p>
          <h1>Monitoring Kamera Real-time</h1>
          <span>Dummy stream siap diganti dengan channel CCTV/Hikonek.</span>
        </div>
        <button className="brown-button"><Icon name="camera" /> TAMBAH KAMERA</button>
      </div>

      <section className="live-layout">
        <div className="panel video-hero">
          <div className="video-surface">
            <div className="scan-lines" />
            <div className="video-label">
              <strong>{primary.name}</strong>
              <span>{primary.hikonekChannelId}</span>
            </div>
            <div className="ai-box">
              <span>AI DETECTION</span>
              <strong>{primary.activeDetections[0]}</strong>
              <small>{primary.confidence}% confidence</small>
            </div>
          </div>
          <div className="video-footer">
            <div>
              <strong>{primary.location}</strong>
              <span>{primary.streamUrl}</span>
            </div>
            <span className="online-pill"><i /> ONLINE</span>
          </div>
        </div>

        <aside className="panel event-feed">
          <h2>AI Prediction Queue</h2>
          {predictionEvents.slice(0, 4).map((event) => (
            <div className="feed-item" key={event.id}>
              <div>
                <strong>{event.type}</strong>
                <span>{event.camera} · {event.time}</span>
              </div>
              <em>{event.confidence}%</em>
            </div>
          ))}
        </aside>
      </section>

      <section className="camera-grid">
        {cameraStreams.map((camera) => (
          <article className="panel camera-card" key={camera.id}>
            <div className="mini-video">
              <span className={`stream-status ${camera.status}`}>{camera.status}</span>
              <Icon name="camera" />
            </div>
            <div className="camera-card-body">
              <strong>{camera.name}</strong>
              <span>{camera.location}</span>
              <small>{camera.hikonekChannelId}</small>
              <div className="detection-row">
                {camera.activeDetections.length > 0 ? (
                  camera.activeDetections.map((item) => <b key={item}>{item}</b>)
                ) : (
                  <em>No active alert</em>
                )}
              </div>
            </div>
          </article>
        ))}
      </section>
      <StatusFeed />
    </AppShell>
  );
}
