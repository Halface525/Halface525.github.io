import { useEffect } from "react";

export function ProjectModal({ project, onClose }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  if (!project) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.4)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl max-h-[80vh] overflow-y-auto p-8 mag-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-6">
          <h2 className="font-display text-3xl font-bold">{project.title}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center transition-colors"
            style={{ border: "1px solid var(--line)", color: "var(--muted)" }}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div
          className="article-body text-base leading-relaxed"
          dangerouslySetInnerHTML={{ __html: project.details }}
        />
        <div className="mt-8 flex gap-4">
          {project.link !== "#" && (
            <a
              href={project.link}
              target="_blank"
              rel="noreferrer"
              className="mag-btn accent"
            >
              访问项目
            </a>
          )}
          {project.github !== "#" && (
            <a
              href={project.github}
              target="_blank"
              rel="noreferrer"
              className="mag-btn"
            >
              GitHub
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
