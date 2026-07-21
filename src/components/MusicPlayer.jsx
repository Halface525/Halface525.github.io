import { useState, useEffect, useRef } from "react";

function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

const MODE_ICONS = {
  list: "fa-list",
  single: "fa-redo",
  random: "fa-random",
};

export function MusicPlayer({
  isOpen,
  setIsOpen,
  playlist,
  currentIndex,
  isPlaying,
  progress,
  duration,
  volume,
  playMode,
  toggle,
  prev,
  next,
  playAt,
  toggleMode,
  seek,
  changeVolume,
}) {
  const [minimized, setMinimized] = useState(false);
  const progressBarRef = useRef(null);

  useEffect(() => {
    if (!isOpen) setMinimized(false);
  }, [isOpen]);

  if (!isOpen) return null;

  const currentTrack = playlist[currentIndex];

  const handleProgressClick = (e) => {
    if (!progressBarRef.current || !duration) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    seek(Math.max(0, Math.min(1, percent)));
  };

  const handleVolumeClick = () => {
    changeVolume(volume === 0 ? 0.5 : 0);
  };

  return (
    <div className={`music-player ${minimized ? "minimized" : ""}`}>
      <button
        className="music-mini"
        onClick={() => setMinimized(false)}
        title="展开播放器"
      >
        <i className={`fas fa-music music-mini-icon ${isPlaying ? "text-[var(--accent)]" : ""}`}></i>
      </button>

      <div className="music-full">
        <div className="music-header">
          <div className="music-cover"></div>
          <div className="music-meta">
            <div className="music-title">{currentTrack?.title || "未播放"}</div>
            <div className="music-artist">{currentTrack?.artist || "-"}</div>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="music-close"
              onClick={() => setMinimized(true)}
              title="最小化"
            >
              <i className="fas fa-minus"></i>
            </button>
            <button
              className="music-close"
              onClick={() => setIsOpen(false)}
              title="关闭"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>

        <div className="music-progress-container">
          <div
            className="music-progress-bar"
            ref={progressBarRef}
            onClick={handleProgressClick}
          >
            <div
              className="music-progress"
              style={{ width: `${duration ? (progress / duration) * 100 : 0}%` }}
            ></div>
          </div>
          <div className="music-time">
            <span>{formatTime(progress)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <div className="music-controls">
          <button className="music-mode-btn" onClick={toggleMode} title={playMode}>
            <i className={`fas ${MODE_ICONS[playMode] || "fa-list"}`}></i>
          </button>
          <button className="music-control-btn" onClick={prev}>
            <i className="fas fa-step-backward"></i>
          </button>
          <button className="music-play-btn" onClick={toggle}>
            <i className={`fas ${isPlaying ? "fa-pause" : "fa-play"}`}></i>
          </button>
          <button className="music-control-btn" onClick={next}>
            <i className="fas fa-step-forward"></i>
          </button>
          <div className="music-volume-wrapper">
            <i
              className={`fas ${volume === 0 ? "fa-volume-mute" : volume < 0.5 ? "fa-volume-down" : "fa-volume-up"}`}
              onClick={handleVolumeClick}
            ></i>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => changeVolume(parseFloat(e.target.value))}
            />
          </div>
        </div>

        <div className="music-playlist">
          {playlist.map((track, index) => (
            <div
              key={index}
              className={`music-item ${index === currentIndex ? "active" : ""}`}
              onClick={() => playAt(index)}
            >
              <span className="music-number">
                {index === currentIndex && isPlaying ? (
                  <i className="fas fa-volume-up music-playing"></i>
                ) : (
                  String(index + 1).padStart(2, "0")
                )}
              </span>
              <div className="music-info">
                <div className="music-title">{track.title}</div>
                <div className="music-artist">{track.artist}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
