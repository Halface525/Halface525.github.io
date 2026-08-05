import { useEffect, useRef } from "react";

// 悬停时圆环收缩的可点击元素
const CLICKABLE_SELECTOR = [
  "a",
  "button",
  "input",
  "textarea",
  "select",
  "summary",
  "label",
  '[role="button"]',
  ".cursor-pointer",
].join(",");

// 桌面端自定义光标：圆环 + 中心点，可点击处收缩，封面聚光灯区域隐藏
export function CursorGlow() {
  const cursorRef = useRef(null);

  useEffect(() => {
    // 仅桌面（支持 hover + 精指针）启用，移动端不生效
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const cursor = cursorRef.current;
    if (!cursor) return;

    const handleMove = (e) => {
      // 与 HomePage 透镜过渡带一致：鼠标在 hero 边界外 W px 内时透镜仍可见（渐变中），光标隐藏
      const W = 110;
      let lensVisible = false;
      // 导航栏区域由光标接管（透镜不显示）
      if (!e.target.closest(".site-navbar")) {
        const hero = document.querySelector(".magazine-hero");
        if (hero) {
          const rect = hero.getBoundingClientRect();
          const dx = Math.max(rect.left - e.clientX, 0, e.clientX - rect.right);
          const dy = Math.max(rect.top - e.clientY, 0, e.clientY - rect.bottom);
          lensVisible = Math.hypot(dx, dy) < W;
        }
      }
      const clickable = !lensVisible && e.target.closest(CLICKABLE_SELECTOR);
      // 实时位置（仅操作 transform，走合成层）
      cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      cursor.style.opacity = lensVisible ? "0" : "1";
      cursor.classList.toggle("is-shrink", !!clickable);
    };

    window.addEventListener("mousemove", handleMove);
    return () => {
      window.removeEventListener("mousemove", handleMove);
    };
  }, []);

  // 始终渲染；初始隐藏，桌面端首次移动鼠标后显示
  return <div ref={cursorRef} className="custom-cursor" style={{ opacity: 0 }} aria-hidden="true" />;
}
