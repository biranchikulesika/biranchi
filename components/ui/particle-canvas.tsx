'use client';

import { useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';

export function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme, resolvedTheme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = window.devicePixelRatio || 1;

    let boids: Boid[] = [];

    const setSize = () => {
      width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.parentElement?.clientHeight || window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
      
      initBoids();
    };

    class Boid {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      maxSpeed: number;
      steerStrength: number;
      
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
        
        // Slightly larger size so the shapes aren't anti-aliased away on light backgrounds
        this.size = Math.random() * 1.5 + 1.5;
        this.maxSpeed = Math.random() * 1.5 + 1.0;
        this.steerStrength = Math.random() * 0.05 + 0.02;
      }

      update(time: number, mouseX: number, mouseY: number) {
        // Create an organic, swirling flow field using layered sine waves
        // This mathematically mimics fluid currents or wind drafts
        const scale1 = 0.003;
        const scale2 = 0.001;
        
        const noise1 = Math.sin(this.x * scale1 + time * 0.0005) * Math.cos(this.y * scale1 - time * 0.0004);
        const noise2 = Math.sin(this.y * scale2 - time * 0.0002) * Math.cos(this.x * scale2 + time * 0.0003);
        
        // The angle of the current at this exact pixel
        const flowAngle = (noise1 + noise2) * Math.PI * 4;
        
        // What velocity the boid WANTS to have
        let targetVx = Math.cos(flowAngle) * this.maxSpeed;
        let targetVy = Math.sin(flowAngle) * this.maxSpeed;
        
        // Mouse scattering (panic reaction when cursor gets near)
        let dx = mouseX - this.x;
        let dy = mouseY - this.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 200 && mouseX !== -1000) {
          const panic = (200 - dist) / 200;
          // Flee violently away from mouse
          targetVx -= (dx / dist) * panic * this.maxSpeed * 4;
          targetVy -= (dy / dist) * panic * this.maxSpeed * 4;
        }
        
        // Smoothly steer towards the target velocity (creates organic, non-robotic turns)
        this.vx += (targetVx - this.vx) * this.steerStrength;
        this.vy += (targetVy - this.vy) * this.steerStrength;
        
        this.x += this.vx;
        this.y += this.vy;
        
        // Wrap gracefully around screen edges
        if (this.x < -20) this.x = width + 20;
        else if (this.x > width + 20) this.x = -20;
        
        if (this.y < -20) this.y = height + 20;
        else if (this.y > height + 20) this.y = -20;
      }

      draw(ctx: CanvasRenderingContext2D, isDark: boolean) {
        // Draw directional boids (like a tiny triangle/dart pointing in their velocity)
        const angle = Math.atan2(this.vy, this.vx);
        
        // Higher contrast for light mode to ensure visibility
        ctx.fillStyle = isDark ? 'rgba(255, 255, 255, 0.65)' : 'rgba(0, 0, 0, 0.85)';
        
        ctx.translate(this.x, this.y);
        ctx.rotate(angle);
        
        // Draw a tiny teardrop/dart shape
        ctx.beginPath();
        ctx.moveTo(this.size * 2, 0); // nose
        ctx.lineTo(-this.size, this.size); // bottom wing
        ctx.lineTo(-this.size * 0.5, 0); // tail indent
        ctx.lineTo(-this.size, -this.size); // top wing
        ctx.closePath();
        ctx.fill();
        
        ctx.rotate(-angle);
        ctx.translate(-this.x, -this.y);
      }
    }

    const initBoids = () => {
      boids = [];
      // Adjust density dynamically. 
      // High enough for a swarm effect, but strictly capped to maintain 60FPS
      const count = Math.min(Math.floor((width * height) / 3000), 800);
      for (let i = 0; i < count; i++) {
        boids.push(new Boid());
      }
    };

    setSize();

    let mouse = { x: -1000, y: -1000 };
    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    
    const onMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseleave', onMouseLeave);
    window.addEventListener('resize', setSize);

    let animationFrame: number;
    let time = 0;

    const render = () => {
      ctx.clearRect(-100, -100, width + 200, height + 200);
      time += 16; 
      
      const isDark = document.documentElement.classList.contains('dark');

      for (let i = 0; i < boids.length; i++) {
        boids[i].update(time, mouse.x, mouse.y);
        boids[i].draw(ctx, isDark);
      }
      
      animationFrame = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', setSize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
      cancelAnimationFrame(animationFrame);
    };
  }, [resolvedTheme, theme]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none opacity-80 dark:opacity-80"
      style={{ mixBlendMode: 'normal' }}
    />
  );
}
