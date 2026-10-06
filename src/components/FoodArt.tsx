import { FOOD_ART } from '../data/foodArt';

/** Ilustración de un alimento. Si no hay dibujo (recetas antiguas), usa el emoji guardado. */
export function FoodArt({
  art,
  emoji,
  size = 48,
  className = '',
}: {
  art?: string;
  emoji?: string;
  size?: number;
  className?: string;
}) {
  const inner = art ? FOOD_ART[art] : undefined;
  if (!inner && emoji) {
    return (
      <span className={`food-emoji ${className}`} style={{ fontSize: size * 0.75 }} aria-hidden="true">
        {emoji}
      </span>
    );
  }
  return (
    <svg
      className={`food ${className}`}
      viewBox="0 0 64 64"
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
      dangerouslySetInnerHTML={{ __html: inner ?? FOOD_ART.cuenco }}
    />
  );
}
