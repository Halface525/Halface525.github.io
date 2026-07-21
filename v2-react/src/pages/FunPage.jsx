import { useEffect, useState } from "react";
import { useDocumentTitle } from "../hooks/useDocumentTitle";
import { projectsList } from "../data/siteData";
import { getCardLabel } from "../utils/helpers";

export function FunPage() {
  useDocumentTitle("半趣 — Halface");
  const [selectedId, setSelectedId] = useState(null);
  const selectedProject = projectsList.find((p) => p.id === selectedId);

  return (
    <section id="fun" className="page active py-16 md:py-24 max-w-6xl mx-auto px-6">
      <div className="text-center mb-16">
        <span
          className="text-xs tracking-[0.3em] uppercase block mb-4"
          style={{ color: "var(--accent)", fontFamily: "'Inter', sans-serif" }}
        >
          Projects
        </span>
        <h1 className="font-display text-4xl md:text-6xl font-bold mb-4">半趣</h1>
        <p className="max-w-md mx-auto" style={{ color: "var(--muted)" }}>
          个人项目与趣味工具集合
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projectsList.map((project) => (
          <article
            key={project.id}
            className="mag-card cursor-pointer group"
            onClick={() => setSelectedId(project.id)}
          >
            <div
              className="aspect-[16/10] flex items-center justify-center text-3xl md:text-4xl font-display font-bold opacity-25 group-hover:opacity-60 transition-opacity"
              style={{ background: "var(--line)", color: "var(--ink)" }}
            >
              {getCardLabel(project.title)}
            </div>
            <div className="p-6">
              <h3 className="font-display text-lg font-bold mb-2 group-hover:text-[var(--accent)] transition-colors">
                {project.title}
              </h3>
              <p className="text-sm" style={{ color: "var(--muted)" }}>
                {project.description}
              </p>
            </div>
          </article>
        ))}
      </div>

      {selectedProject && (
        <ProjectModal project={selectedProject} onClose={() => setSelectedId(null)} />
      )}
    </section>
  );
}

function ProjectModal({ project, onClose }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.5)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg max-h-[80vh] overflow-y-auto p-8 relative"
        style={{ background: "var(--paper)", border: "1px solid var(--line)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 opacity-40 hover:opacity-100 transition-opacity"
        >
          <i className="fas fa-times"></i>
        </button>
        <h2 className="font-display text-2xl font-bold mb-4">{project.title}</h2>
        <p className="mb-4" style={{ color: "var(--muted)" }}>
          {project.description}
        </p>
        <div className="mb-6" dangerouslySetInnerHTML={{ __html: project.details }} />
        <div className="flex gap-3">
          {project.link !== "#" && (
            <a href={project.link} target="_blank" rel="noreferrer" className="mag-btn accent">
              查看项目
            </a>
          )}
          {project.github !== "#" && (
            <a href={project.github} target="_blank" rel="noreferrer" className="mag-btn">
              GitHub
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
