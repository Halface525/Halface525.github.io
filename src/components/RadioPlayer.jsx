import { useRef } from "react";

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

export function RadioPlayer({
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
  const dialRef = useRef(null);
  const currentTrack = playlist[currentIndex];
  const progressPct = duration ? (progress / duration) * 100 : 0;
  const dialAngle = -60 + progressPct * 1.2; // 0% ~ 100% -> -60° ~ 60°
  const volumeAngle = -135 + volume * 270;

  const handleDialClick = (e) => {
    if (!dialRef.current || !duration) return;
    const rect = dialRef.current.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    seek(percent);
  };

  const handleVolumeKnob = () => {
    changeVolume(volume === 0 ? 0.5 : 0);
  };

  return (
    <div className="radio">
      <div className="radio-handle" aria-hidden="true"></div>
      <div className="radio-body">
        <div className="radio-top">
          {/* 喇叭 */}
          <div className="radio-speaker" aria-hidden="true"></div>
          {/* 调谐刻度盘（点击跳转进度） */}
          <div className="radio-dial" ref={dialRef} onClick={handleDialClick} title="点击刻度跳转进度">
            <div className="radio-dial-needle" style={{ transform: `translateX(-50%) rotate(${dialAngle}deg)` }}></div>
            <div className="radio-dial-hub"></div>
          </div>
          {/* 指示灯 + 旋钮 */}
          <div className="radio-side">
            <span className={`radio-led ${isPlaying ? "on" : ""}`}></span>
            <div
              className="radio-knob radio-knob-volume"
              onClick={handleVolumeKnob}
              title={volume === 0 ? "恢复音量" : "静音"}
            >
              <span className="radio-knob-indicator" style={{ transform: `rotate(${volumeAngle}deg)` }}></span>
            </div>
            <div
              className="radio-knob radio-knob-mode"
              onClick={toggleMode}
              title={`播放模式：${playMode}`}
            >
              <i className={`fas ${MODE_ICONS[playMode] || "fa-list"}`}></i>
            </div>
          </div>
        </div>

        {/* 曲目信息 */}
        <div className="radio-info">
          <div className="radio-track">
            <span className="radio-track-title">{currentTrack?.title || "未播放"}</span>
            <span className="radio-track-artist">{currentTrack?.artist || "-"}</span>
          </div>
          <div className="radio-time">
            <span>{formatTime(progress)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* 控制按钮 */}
        <div className="radio-controls">
          <button className="radio-btn" onClick={prev} title="上一首">
            <i className="fas fa-step-backward"></i>
          </button>
          <button className="radio-btn radio-btn-play" onClick={toggle} title="播放 / 暂停">
            <i className={`fas ${isPlaying ? "fa-pause" : "fa-play"}`}></i>
          </button>
          <button className="radio-btn" onClick={next} title="下一首">
            <i className="fas fa-step-forward"></i>
          </button>
        </div>

        {/* 播放列表 */}
        <div className="radio-playlist">
          {playlist.map((track, index) => (
            <button
              key={index}
              className={`radio-track-item ${index === currentIndex ? "active" : ""}`}
              onClick={() => playAt(index)}
            >
              <span className="radio-track-num">{String(index + 1).padStart(2, "0")}</span>
              <span className="radio-track-name">{track.title}</span>
              <span className="radio-track-artist">{track.artist}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
