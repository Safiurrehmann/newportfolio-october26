import { useEffect, useRef, useState } from "react";
import { avatarFrame } from "../shared/avatar.mjs";

export default function HeroAvatar({
  progress,
  reduced,
}: {
  progress: number;
  reduced: boolean;
}) {
  const root = useRef<HTMLButtonElement>(null);
  const [blinking, setBlinking] = useState(false);
  const frame = avatarFrame(progress, reduced);

  useEffect(() => {
    if (reduced) return;
    let raf = 0;
    let pointerX = window.innerWidth / 2;
    let pointerY = window.innerHeight / 2;
    const render = () => {
      raf = 0;
      const element = root.current;
      if (!element) return;
      const rect = element.getBoundingClientRect();
      const x = Math.max(
        -1,
        Math.min(
          1,
          (pointerX - (rect.left + rect.width / 2)) /
            (window.innerWidth * 0.42),
        ),
      );
      const y = Math.max(
        -1,
        Math.min(
          1,
          (pointerY - (rect.top + rect.height / 2)) /
            (window.innerHeight * 0.42),
        ),
      );
      element.style.setProperty("--look-x", x.toFixed(3));
      element.style.setProperty("--look-y", y.toFixed(3));
    };
    const track = (event: PointerEvent) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (!raf) raf = requestAnimationFrame(render);
    };
    window.addEventListener("pointermove", track, { passive: true });
    render();
    return () => {
      window.removeEventListener("pointermove", track);
      cancelAnimationFrame(raf);
    };
  }, [reduced]);

  const blink = () => {
    setBlinking(false);
    requestAnimationFrame(() => setBlinking(true));
  };

  return (
    <button
      ref={root}
      type="button"
      className="hero-avatar"
      aria-label="Safi’s avatar — click to blink"
      title="Hi — click me"
      onClick={blink}
      style={
        {
          "--avatar-scale": frame.scale,
          "--avatar-x": `${frame.x}px`,
          "--avatar-y": `${frame.y}px`,
          "--avatar-radius": `${frame.radius}%`,
          "--avatar-turn": `${frame.turn}deg`,
        } as React.CSSProperties
      }
    >
      <span className="avatar-tilt">
        <img src="/safi-avatar.png" alt="" width="512" height="512" />
        <span className="avatar-shine" />
        <span className="avatar-eye eye-left">
          <i />
        </span>
        <span className="avatar-eye eye-right">
          <i />
        </span>
        <span
          className={`avatar-lids ${blinking ? "blink" : ""}`}
          onAnimationEnd={() => setBlinking(false)}
        >
          <i className="lid-left" />
          <i className="lid-right" />
        </span>
      </span>
    </button>
  );
}
