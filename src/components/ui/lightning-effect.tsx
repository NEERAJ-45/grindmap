"use client";

import { useEffect, useRef, useState } from "react";

interface LightningEffectProps {
  className?: string;
}

export function LightningEffect({ className = "" }: LightningEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let lastFlash = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth * 2;
      canvas.height = canvas.offsetHeight * 2;
      ctx.scale(2, 2);
    };
    resize();
    window.addEventListener("resize", resize);

    const drawLightning = (
      x: number,
      y: number,
      angle: number,
      length: number,
      width: number,
      depth: number
    ) => {
      if (depth <= 0 || length <= 0) return;

      const segments = Math.floor(length / 10);
      ctx.beginPath();
      ctx.moveTo(x, y);

      let cx = x;
      let cy = y;

      for (let i = 0; i < segments; i++) {
        const segLen = length / segments;
        const jitter = (Math.random() - 0.5) * 30;
        cx += Math.cos(angle) * segLen + jitter;
        cy += Math.sin(angle) * segLen;
        ctx.lineTo(cx, cy);
      }

      ctx.strokeStyle = `rgba(59, 130, 246, ${0.15 * (depth / 4)})`;
      ctx.lineWidth = width;
      ctx.shadowBlur = 20;
      ctx.shadowColor = "rgba(59, 130, 246, 0.3)";
      ctx.stroke();

      // Branches
      if (depth > 1 && Math.random() > 0.4) {
        const branchAngle = angle + (Math.random() - 0.5) * 1.2;
        drawLightning(cx, cy, branchAngle, length * 0.4, width * 0.5, depth - 1);
      }
    };

    const animate = (time: number) => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;

      // Flash every 3-6 seconds
      if (time - lastFlash > 3000 + Math.random() * 3000) {
        lastFlash = time;

        ctx.clearRect(0, 0, w, h);
        setVisible(true);

        const startX = Math.random() * w;
        drawLightning(startX, 0, Math.PI / 2 + (Math.random() - 0.5) * 0.3, h * 0.7, 2, 4);

        if (Math.random() > 0.5) {
          const startX2 = Math.random() * w;
          drawLightning(startX2, 0, Math.PI / 2 + (Math.random() - 0.5) * 0.3, h * 0.5, 1.5, 3);
        }

        // Fade out via CSS opacity instead of pixel-scanning
        setTimeout(() => {
          setVisible(false);
          // Clear canvas after fade completes
          setTimeout(() => {
            ctx.clearRect(0, 0, w, h);
          }, 600);
        }, 150);
      }

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 ${className}`}
      style={{
        opacity: visible ? 0.35 : 0,
        transition: "opacity 0.5s ease-out",
      }}
    />
  );
}
