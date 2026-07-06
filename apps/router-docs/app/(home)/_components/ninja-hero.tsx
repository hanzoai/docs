'use client';

import { useState, useEffect, useCallback } from 'react';

const roles = [
  { emoji: '🥷', label: 'Ninja' },
  { emoji: '👩‍💻', label: 'DevOps Engineer' },
  { emoji: '🔍', label: 'Code Reviewer' },
  { emoji: '🛡️', label: 'Security Analyst' },
  { emoji: '🎨', label: 'UI Designer' },
  { emoji: '📊', label: 'Data Scientist' },
  { emoji: '🧪', label: 'QA Tester' },
  { emoji: '📝', label: 'Tech Writer' },
  { emoji: '🏗️', label: 'Architect' },
  { emoji: '🚀', label: 'Release Manager' },
];

export function NinjaHero() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<'visible' | 'poofing' | 'hidden' | 'appearing'>('visible');
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; angle: number; speed: number; size: number }>>([]);

  const createParticles = useCallback(() => {
    const newParticles = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: 0,
      y: 0,
      angle: (i * 30) + (Math.random() * 20 - 10),
      speed: 40 + Math.random() * 60,
      size: 4 + Math.random() * 6,
    }));
    setParticles(newParticles);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      // Start poof out
      setPhase('poofing');
      createParticles();

      setTimeout(() => {
        setPhase('hidden');
        setCurrentIndex((prev) => (prev + 1) % roles.length);

        setTimeout(() => {
          setPhase('appearing');
          createParticles();

          setTimeout(() => {
            setPhase('visible');
            setParticles([]);
          }, 400);
        }, 150);
      }, 400);
    }, 2800);

    return () => clearInterval(interval);
  }, [createParticles]);

  const role = roles[currentIndex];

  return (
    <div className="ninja-stage">
      <div className="ninja-container">
        {/* Particles */}
        {particles.length > 0 && (
          <div className="ninja-particles">
            {particles.map((p) => (
              <span
                key={p.id}
                className="ninja-particle"
                style={{
                  '--angle': `${p.angle}deg`,
                  '--speed': `${p.speed}px`,
                  '--size': `${p.size}px`,
                } as React.CSSProperties}
              />
            ))}
          </div>
        )}

        {/* Emoji */}
        <span
          className={`ninja-emoji ${
            phase === 'poofing' ? 'ninja-poof-out' :
            phase === 'hidden' ? 'ninja-hidden' :
            phase === 'appearing' ? 'ninja-poof-in' :
            'ninja-visible'
          }`}
          role="img"
          aria-label={role.label}
        >
          {role.emoji}
        </span>
      </div>

      {/* Role label */}
      <span
        className={`ninja-role ${
          phase === 'poofing' || phase === 'hidden' ? 'ninja-role-out' : 'ninja-role-in'
        }`}
      >
        {role.label}
      </span>
    </div>
  );
}
