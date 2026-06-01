"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useMemo, useState } from "react";
import {
  backendWebSocketUrl,
  BackendSnapshot,
  CameraStream,
  newestEvents,
  PredictionEvent,
  streamUrl,
} from "../api-client";
import { Icon, StatusFeed } from "../ui";

type SiteGroup = {
  location: string;
  cameras: CameraStream[];
  online: number;
  degraded: number;
  offline: number;
};

export function LiveMonitor({ initialSnapshot }: { initialSnapshot: BackendSnapshot }) {
  const [cameras, setCameras] = useState<CameraStream[]>(initialSnapshot.cameras);
  const [events, setEvents] = useState<PredictionEvent[]>(initialSnapshot.events);
  const [connected, setConnected] = useState(initialSnapshot.online);
  const [selectedSite, setSelectedSite] = useState<string>("ALL");
  const [selectedCameraId, setSelectedCameraId] = useState<string | null>(
    initialSnapshot.cameras[0]?.id ?? null,
  );
  const apiBase = process.env.NEXT_PUBLIC_HIKONEK_STREAM_URL || "http://localhost:8010";
  const feedEvents = useMemo(() => newestEvents(events, 6), [events]);
  const siteGroups = useMemo<SiteGroup[]>(() => {
    const grouped = new Map<string, CameraStream[]>();
    for (const camera of cameras) {
      const location = camera.location || "Unassigned";
      grouped.set(location, [...(grouped.get(location) ?? []), camera]);
    }

    return [...grouped.entries()]
      .map(([location, items]) => ({
        location,
        cameras: items.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true })),
        online: items.filter((camera) => camera.status === "online").length,
        degraded: items.filter((camera) => camera.status === "degraded").length,
        offline: items.filter((camera) => camera.status === "offline").length,
      }))
      .sort((a, b) => a.location.localeCompare(b.location));
  }, [cameras]);
  const visibleGroups = useMemo(
    () => (
      selectedSite === "ALL"
        ? siteGroups
        : siteGroups.filter((group) => group.location === selectedSite)
    ),
    [selectedSite, siteGroups],
  );
  const visibleCameras = useMemo(
    () => visibleGroups.flatMap((group) => group.cameras),
    [visibleGroups],
  );
  const selectedVisibleCamera = visibleCameras.find((camera) => camera.id === selectedCameraId);
  const primary = selectedVisibleCamera ?? visibleCameras[0] ?? null;
  const readyCount = cameras.filter((camera) => camera.status === "online").length;

  useEffect(() => {
    let cancelled = false;

    async function refreshCameras() {
      try {
        const response = await fetch(`${apiBase}/cameras`, {
          cache: "no-store",
        });
        if (!response.ok) throw new Error("Camera refresh failed");
        const nextCameras = (await response.json()) as CameraStream[];
        if (!cancelled) {
          setCameras(nextCameras);
          setConnected(true);
        }
      } catch {
        if (!cancelled) setConnected(false);
      }
    }

    const id = window.setInterval(refreshCameras, 5000);
    void refreshCameras();
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, [apiBase]);

  async function refreshStreams() {
    try {
      const response = await fetch(`${apiBase}/refresh-cameras`, { method: "POST" });
      if (!response.ok) throw new Error("Camera refresh failed");
      const payload = (await response.json()) as { cameras: CameraStream[] };
      setCameras(payload.cameras);
      setConnected(true);
    } catch {
      setConnected(false);
    }
  }

  useEffect(() => {
    let socket: WebSocket | null = null;
    let reconnect: number | null = null;
    let closed = false;

    function connect() {
      socket = new WebSocket(backendWebSocketUrl());
      socket.onopen = () => setConnected(true);
      socket.onmessage = (message) => {
        const event = JSON.parse(message.data) as PredictionEvent;
        setEvents((current) => [event, ...current.filter((item) => item.id !== event.id)].slice(0, 200));
      };
      socket.onclose = () => {
        setConnected(false);
        if (!closed) reconnect = window.setTimeout(connect, 3000);
      };
      socket.onerror = () => socket?.close();
    }

    connect();
    return () => {
      closed = true;
      if (reconnect) window.clearTimeout(reconnect);
      socket?.close();
    };
  }, []);

  return (
    <>
      <div className="screen-heading">
        <div>
          <p className="breadcrumb-lite">Live View</p>
          <h1>Monitoring Kamera Real-time</h1>
          <span>
            {connected
              ? `${readyCount}/${cameras.length} stream siap dari hikonek-stream.`
              : "Menunggu koneksi hikonek-stream."}
          </span>
        </div>
        <button className="brown-button" onClick={() => void refreshStreams()} type="button">
          <Icon name="camera" /> REFRESH STREAM
        </button>
      </div>

      <section className="site-strip" aria-label="CCTV region filters">
        <button
          className={selectedSite === "ALL" ? "active" : ""}
          onClick={() => setSelectedSite("ALL")}
          type="button"
        >
          <strong>Semua SPPG</strong>
          <span>{readyCount}/{cameras.length} ready</span>
        </button>
        {siteGroups.map((group) => (
          <button
            className={selectedSite === group.location ? "active" : ""}
            key={group.location}
            onClick={() => setSelectedSite(group.location)}
            type="button"
          >
            <strong>{group.location}</strong>
            <span>{group.online} online, {group.degraded} loading, {group.offline} offline</span>
          </button>
        ))}
      </section>

      <section className="live-layout">
        <div className="panel video-hero">
          <div className="video-surface">
            {primary ? (
              <img className="stream-image" src={streamUrl(primary.id)} alt={`Live stream ${primary.name}`} />
            ) : (
              <div className="empty-stream">
                <Icon name="camera" />
                <strong>Belum ada kamera</strong>
                <span>Isi CAMERA_STREAMS_JSON atau kredensial Hik-Connect di backend.</span>
              </div>
            )}
            <div className="video-label">
              <strong>{primary?.name ?? "No camera"}</strong>
              <span>{primary?.hikonekChannelId ?? "hikonek-stream"}</span>
            </div>
            <div className="ai-box">
              <span>AI DETECTION</span>
              <strong>{primary?.activeDetections[0] ?? "NO ACTIVE ALERT"}</strong>
              <small>{primary?.confidence ?? 0}% confidence</small>
            </div>
          </div>
          <div className="video-footer">
            <div>
              <strong>{primary?.location || "No camera configured"}</strong>
              <span>{primary ? `${primary.status.toUpperCase()} - ${streamUrl(primary.id)}` : "Backend has no camera stream yet"}</span>
            </div>
            <span className={`online-pill ${primary?.status ?? "offline"}`}><i /> {primary?.status ?? "offline"}</span>
          </div>
        </div>

        <aside className="panel event-feed">
          <h2>AI Prediction Queue</h2>
          {feedEvents.map((event) => (
            <div className="feed-item" key={event.id}>
              <div>
                <strong>{event.type}</strong>
                <span>{event.camera} - {event.time}</span>
              </div>
              <em>{event.confidence}%</em>
            </div>
          ))}
          {feedEvents.length === 0 && <p className="empty-copy">Belum ada prediksi masuk.</p>}
        </aside>
      </section>

      <section className="site-camera-groups">
        {visibleGroups.map((group) => (
          <div className="site-camera-group" key={group.location}>
            <div className="site-group-heading">
              <div>
                <strong>{group.location}</strong>
                <span>{group.cameras.length} kamera terdaftar</span>
              </div>
              <em>{group.online} ready</em>
            </div>
            <div className="camera-grid">
              {group.cameras.map((camera) => (
                <article
                  className={`panel camera-card ${primary?.id === camera.id ? "selected" : ""}`}
                  key={camera.id}
                >
                  <button
                    className="mini-video"
                    onClick={() => setSelectedCameraId(camera.id)}
                    type="button"
                  >
                    <img className="mini-stream-image" src={streamUrl(camera.id)} alt={`Live stream ${camera.name}`} />
                    <span className={`stream-status ${camera.status}`}>{camera.status}</span>
                  </button>
                  <div className="camera-card-body">
                    <strong>{camera.name}</strong>
                    <span>{camera.location || "Unassigned location"}</span>
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
            </div>
          </div>
        ))}
      </section>
      <StatusFeed />
    </>
  );
}
