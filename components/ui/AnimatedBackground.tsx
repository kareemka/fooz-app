"use client";

import { useEffect, useRef } from "react";

interface Shape {
    x: number;
    y: number;
    size: number;
    speedX: number;
    speedY: number;
    rotation: number;
    rotationSpeed: number;
    type: "circle" | "triangle" | "square" | "cross";
    opacity: number;
    color: string;
    pulsePhase: number;
}

const AnimatedBackground = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const shapesRef = useRef<Shape[]>([]);
    const animationRef = useRef<number>(0);
    const mouseRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        // Detect mobile to reduce overhead
        const isMobile = window.innerWidth < 768;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d", { alpha: true });
        if (!ctx) return;

        const colors = ["#ff007f", "#00f2ff", "#b026ff", "#00ff9d"];
        const shapeTypes: Shape["type"][] = ["circle", "triangle", "square", "cross"];

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        const createShapes = () => {
            // Further reduce count on mobile for performance
            const shapeCount = isMobile ? 12 : Math.min(25, Math.max(12, Math.floor(window.innerWidth / 80)));
            shapesRef.current = [];

            for (let i = 0; i < shapeCount; i++) {
                shapesRef.current.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    size: Math.random() * 25 + 15, // Slightly smaller
                    speedX: (Math.random() - 0.5) * 0.25,
                    speedY: (Math.random() - 0.5) * 0.25,
                    rotation: Math.random() * Math.PI * 2,
                    rotationSpeed: (Math.random() - 0.5) * 0.004,
                    type: shapeTypes[Math.floor(Math.random() * shapeTypes.length)],
                    opacity: Math.random() * 0.15 + 0.1,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    pulsePhase: Math.random() * Math.PI * 2,
                });
            }
        };

        const drawShape = (shape: Shape, time: number) => {
            ctx.save();
            ctx.translate(shape.x, shape.y);
            ctx.rotate(shape.rotation);

            const pulse = Math.sin(time * 0.001 + shape.pulsePhase) * 0.1 + 0.9;
            ctx.globalAlpha = shape.opacity * pulse;

            ctx.strokeStyle = shape.color;
            ctx.lineWidth = isMobile ? 1.5 : 2; // Thinner on mobile
            ctx.lineCap = "round";

            const s = shape.size;
            switch (shape.type) {
                case "circle":
                    ctx.beginPath(); ctx.arc(0, 0, s / 2, 0, Math.PI * 2); ctx.stroke(); break;
                case "triangle":
                    ctx.beginPath(); ctx.moveTo(0, -s / 2); ctx.lineTo(s / 2, s / 2); ctx.lineTo(-s / 2, s / 2); ctx.closePath(); ctx.stroke(); break;
                case "square":
                    ctx.beginPath(); ctx.roundRect(-s / 2, -s / 2, s, s, s / 8); ctx.stroke(); break;
                case "cross":
                    const h = s / 2; ctx.beginPath(); ctx.moveTo(-h, -h); ctx.lineTo(h, h); ctx.moveTo(h, -h); ctx.lineTo(-h, h); ctx.stroke(); break;
            }
            ctx.restore();
        };

        const animate = (time: number) => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const mouseX = mouseRef.current.x || 0;
            const mouseY = mouseRef.current.y || 0;
            const influenceX = (mouseX / canvas.width - 0.5) * 30;
            const influenceY = (mouseY / canvas.height - 0.5) * 30;

            shapesRef.current.forEach((shape, index) => {
                const parallax = (index % 3 + 1) * 0.3;
                shape.x += shape.speedX + influenceX * 0.001 * parallax;
                shape.y += shape.speedY + influenceY * 0.001 * parallax;
                shape.rotation += shape.rotationSpeed;

                if (shape.x < -shape.size) shape.x = canvas.width + shape.size;
                if (shape.x > canvas.width + shape.size) shape.x = -shape.size;
                if (shape.y < -shape.size) shape.y = canvas.height + shape.size;
                if (shape.y > canvas.height + shape.size) shape.y = -shape.size;

                drawShape(shape, time);
            });

            animationRef.current = requestAnimationFrame(animate);
        };

        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
        };

        resizeCanvas();
        createShapes();
        animationRef.current = requestAnimationFrame(animate);

        window.addEventListener("resize", () => { resizeCanvas(); createShapes(); });
        if (!isMobile) window.addEventListener("mousemove", handleMouseMove);

        return () => {
            cancelAnimationFrame(animationRef.current);
            window.removeEventListener("resize", resizeCanvas);
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 z-0 pointer-events-none opacity-60 will-change-transform"
            style={{ background: "transparent" }}
        />
    );
};

export default AnimatedBackground;
