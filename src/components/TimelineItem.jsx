export function TimelineItem({ item, isLast }) {
  return (
    <div className={`relative pl-8 ${isLast ? "" : "pb-10"}`}>
      <div className="timeline-line"></div>
      <div className="timeline-dot"></div>
      <div>
        <div className="flex items-center gap-3 mb-1">
          <span className="text-sm font-semibold" style={{ color: "var(--ink)" }}>
            {item.time}
          </span>
          <span
            className={`status-tag ${
              item.status === "进行中" ? "status-ongoing" : "status-completed"
            }`}
          >
            {item.status}
          </span>
        </div>
        <h4 className="font-display text-lg font-bold mb-1" style={{ color: "var(--ink)" }}>
          {item.title}
        </h4>
        <p className="text-sm mb-3" style={{ color: "var(--ink)", opacity: 0.7 }}>
          {item.desc}
        </p>
        <div className="flex flex-wrap gap-2">
          {item.skills.map((skill) => (
            <span
              key={skill}
              className="text-[10px] tracking-wider uppercase px-2 py-0.5"
              style={{
                border: "1px solid var(--ink)",
                opacity: 0.6,
                fontFamily: "'Inter', sans-serif",
                color: "var(--ink)",
              }}
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
