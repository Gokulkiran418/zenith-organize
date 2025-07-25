import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface DotGridProps {
  dotSize?: number;
  gap?: number;
  baseColor?: string;
  activeColor?: string;
  proximity?: number;
  speedTrigger?: number;
  shockRadius?: number;
  shockStrength?: number;
  maxSpeed?: number;
  resistance?: number;
  returnDuration?: number;
  className?: string;
  style?: React.CSSProperties;
}

const DotGrid: React.FC<DotGridProps> = ({
  dotSize = 4,
  gap = 20,
  baseColor = 'hsl(var(--primary) / 0.3)',
  activeColor = 'hsl(var(--primary))',
  proximity = 80,
  speedTrigger = 100,
  shockRadius = 150,
  shockStrength = 8,
  maxSpeed = 5000,
  resistance = 750,
  returnDuration = 1.5,
  className = '',
  style = {},
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<HTMLDivElement[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, prevX: 0, prevY: 0 });
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const createDots = () => {
      container.innerHTML = '';
      dotsRef.current = [];

      const rect = container.getBoundingClientRect();
      const cols = Math.floor(rect.width / gap);
      const rows = Math.floor(rect.height / gap);

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const dot = document.createElement('div');
          dot.style.position = 'absolute';
          dot.style.width = `${dotSize}px`;
          dot.style.height = `${dotSize}px`;
          dot.style.backgroundColor = baseColor;
          dot.style.borderRadius = '50%';
          dot.style.left = `${col * gap + gap / 2}px`;
          dot.style.top = `${row * gap + gap / 2}px`;
          dot.style.transform = 'translate(-50%, -50%)';
          dot.style.transition = 'all 0.3s ease';
          dot.style.pointerEvents = 'none';

          // Store original position
          (dot as any).originalX = col * gap + gap / 2;
          (dot as any).originalY = row * gap + gap / 2;
          (dot as any).currentX = (dot as any).originalX;
          (dot as any).currentY = (dot as any).originalY;

          container.appendChild(dot);
          dotsRef.current.push(dot);
        }
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseRef.current.prevX = mouseRef.current.x;
      mouseRef.current.prevY = mouseRef.current.y;
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;

      const mouseSpeed = Math.sqrt(
        Math.pow(mouseRef.current.x - mouseRef.current.prevX, 2) +
        Math.pow(mouseRef.current.y - mouseRef.current.prevY, 2)
      );

      dotsRef.current.forEach((dot) => {
        const dotX = (dot as any).currentX;
        const dotY = (dot as any).currentY;
        const distance = Math.sqrt(
          Math.pow(mouseRef.current.x - dotX, 2) +
          Math.pow(mouseRef.current.y - dotY, 2)
        );

        if (distance < proximity) {
          const force = (proximity - distance) / proximity;
          const angle = Math.atan2(dotY - mouseRef.current.y, dotX - mouseRef.current.x);
          
          // Apply displacement
          const displacement = force * 15;
          const newX = dotX + Math.cos(angle) * displacement;
          const newY = dotY + Math.sin(angle) * displacement;

          (dot as any).currentX = newX;
          (dot as any).currentY = newY;

          gsap.to(dot, {
            x: newX - (dot as any).originalX,
            y: newY - (dot as any).originalY,
            backgroundColor: activeColor,
            scale: 1 + force * 0.5,
            duration: 0.1,
            ease: "power2.out"
          });

          // Apply inertia effect for fast mouse movement
          if (mouseSpeed > speedTrigger) {
            const inertiaForce = Math.min(mouseSpeed / maxSpeed, 1);
            const inertiaX = newX + (mouseRef.current.x - mouseRef.current.prevX) * inertiaForce * 2;
            const inertiaY = newY + (mouseRef.current.y - mouseRef.current.prevY) * inertiaForce * 2;

            gsap.to(dot, {
              x: inertiaX - (dot as any).originalX,
              y: inertiaY - (dot as any).originalY,
              duration: 0.3,
              ease: "power2.out",
              onComplete: () => {
                // Return to original position
                gsap.to(dot, {
                  x: 0,
                  y: 0,
                  backgroundColor: baseColor,
                  scale: 1,
                  duration: returnDuration,
                  ease: "power2.out"
                });
                (dot as any).currentX = (dot as any).originalX;
                (dot as any).currentY = (dot as any).originalY;
              }
            });
          }
        } else {
          // Return to original position
          gsap.to(dot, {
            x: 0,
            y: 0,
            backgroundColor: baseColor,
            scale: 1,
            duration: 0.3,
            ease: "power2.out"
          });
          (dot as any).currentX = (dot as any).originalX;
          (dot as any).currentY = (dot as any).originalY;
        }
      });
    };

    const handleClick = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      dotsRef.current.forEach((dot) => {
        const dotX = (dot as any).originalX;
        const dotY = (dot as any).originalY;
        const distance = Math.sqrt(
          Math.pow(clickX - dotX, 2) + Math.pow(clickY - dotY, 2)
        );

        if (distance < shockRadius) {
          const force = (shockRadius - distance) / shockRadius;
          const angle = Math.atan2(dotY - clickY, dotX - clickX);
          const displacement = force * shockStrength * 8;

          gsap.to(dot, {
            x: Math.cos(angle) * displacement,
            y: Math.sin(angle) * displacement,
            backgroundColor: activeColor,
            scale: 1 + force,
            duration: 0.1,
            ease: "power2.out",
            onComplete: () => {
              gsap.to(dot, {
                x: 0,
                y: 0,
                backgroundColor: baseColor,
                scale: 1,
                duration: returnDuration,
                ease: "elastic.out(1, 0.5)"
              });
            }
          });
        }
      });
    };

    const handleResize = () => {
      createDots();
    };

    createDots();
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('click', handleClick);
    window.addEventListener('resize', handleResize);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('click', handleClick);
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [dotSize, gap, baseColor, activeColor, proximity, speedTrigger, shockRadius, shockStrength, maxSpeed, resistance, returnDuration]);

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 pointer-events-none ${className}`}
      style={{
        zIndex: -1,
        ...style,
      }}
    />
  );
};

export default DotGrid;