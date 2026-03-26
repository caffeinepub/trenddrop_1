import { Button } from "@/components/ui/button";
import { ArrowRight, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef } from "react";

interface HeroProps {
  onShopNow: () => void;
}

function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const particles: Array<{
      x: number;
      y: number;
      r: number;
      vx: number;
      vy: number;
      alpha: number;
      decay: number;
      color: string;
    }> = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const COLORS = [
      "rgba(242,106,46,",
      "rgba(120,100,255,",
      "rgba(80,180,255,",
    ];

    const spawnParticle = () => {
      particles.push({
        x: Math.random() * canvas.width,
        y: canvas.height + 10,
        r: Math.random() * 2.5 + 0.5,
        vx: (Math.random() - 0.5) * 0.8,
        vy: -(Math.random() * 0.8 + 0.4),
        alpha: 0,
        decay: Math.random() * 0.004 + 0.002,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      });
    };

    let frame = 0;
    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frame++;
      if (frame % 4 === 0) spawnParticle();

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.alpha < 0.8) p.alpha += 0.02;
        else p.alpha -= p.decay;

        if (p.alpha <= 0 || p.y < -10) {
          particles.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.alpha})`;
        ctx.fill();
      }

      animId = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  // tabIndex={-1} removes canvas from tab order; no focusable role needed
  return (
    <canvas
      ref={canvasRef}
      tabIndex={-1}
      className="absolute inset-0 w-full h-full pointer-events-none focus:outline-none"
    />
  );
}

export function Hero({ onShopNow }: HeroProps) {
  return (
    <section
      className="relative overflow-hidden min-h-[580px] flex items-center animate-aurora"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.08 0.025 280), oklch(0.12 0.035 255), oklch(0.10 0.04 230), oklch(0.15 0.03 200), oklch(0.18 0.05 40), oklch(0.10 0.04 280))",
        backgroundSize: "300% 300%",
      }}
      data-ocid="hero.section"
    >
      {/* Aurora orbs */}
      <div
        className="absolute -top-40 -right-24 w-[600px] h-[600px] rounded-full animate-aurora-orb-1 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(circle at 40% 40%, oklch(0.65 0.19 40 / 0.4) 0%, oklch(0.55 0.22 30 / 0.2) 40%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      <div
        className="absolute -bottom-32 -left-20 w-[500px] h-[500px] rounded-full animate-aurora-orb-2 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(circle at 60% 60%, oklch(0.55 0.25 280 / 0.35) 0%, oklch(0.45 0.2 260 / 0.15) 50%, transparent 70%)",
          filter: "blur(50px)",
        }}
      />
      <div
        className="absolute top-1/4 left-1/3 w-[400px] h-[400px] rounded-full animate-aurora-orb-3 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(circle, oklch(0.6 0.2 220 / 0.2) 0%, transparent 60%)",
          filter: "blur(60px)",
        }}
      />

      {/* Floating particles */}
      <ParticleCanvas />

      {/* Dot grid overlay */}
      <svg
        role="presentation"
        className="absolute inset-0 w-full h-full opacity-[0.04] pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="dots"
            x="0"
            y="0"
            width="24"
            height="24"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="2" cy="2" r="1.5" fill="white" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dots)" />
      </svg>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24 w-full">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-orange-300 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-6">
              <Zap className="w-3.5 h-3.5" />
              Viral Products, Delivered Fast
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-tight tracking-tight mb-5"
            >
              The Internet's Most{" "}
              <span className="text-brand">Viral Products!</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-white/70 text-lg mb-8 max-w-lg leading-relaxed"
            >
              Handpicked trending items from TikTok, Instagram &amp; Reddit —
              delivered straight to your door. Be first, look amazing.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap gap-3"
            >
              <Button
                onClick={onShopNow}
                size="lg"
                className="bg-brand hover:bg-brand-dark text-white font-bold uppercase tracking-wider px-7 shadow-lg shadow-brand/30 transition-all duration-200"
                data-ocid="hero.primary_button"
              >
                Shop Trending Now
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-white/30 text-white bg-white/10 backdrop-blur-sm hover:bg-white/20 font-semibold uppercase tracking-wider px-7"
                data-ocid="hero.secondary_button"
              >
                Explore New Arrivals
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-8 flex items-center gap-6"
            >
              {[
                { value: "50K+", label: "Happy Customers" },
                { value: "500+", label: "Viral Products" },
                { value: "4.9★", label: "Average Rating" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }}
                >
                  <div className="text-xl font-black text-white">
                    {stat.value}
                  </div>
                  <div className="text-xs text-white/50 mt-0.5">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
