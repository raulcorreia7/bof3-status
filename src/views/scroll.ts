export function scrollToSection(id: string, smooth = true): void {
  const target = document.getElementById(id);
  if (!target) return;
  const calm = !smooth || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  target.scrollIntoView({ behavior: calm ? "auto" : "smooth", block: "start" });
  target.focus({ preventScroll: true });
}
