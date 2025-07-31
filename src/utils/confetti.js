import confetti from "canvas-confetti";

/**
 * Fire confetti burst (200 particles).
 */
export function fireConfetti() {
  confetti({
    particleCount: 200,
    spread: 70,
    origin: { y: 0.7 },
    colors: ["#00C4B3", "#8453E3", "#FF6C5C", "#FFD166", "#60a5fa", "#f472b6"]
  });
}