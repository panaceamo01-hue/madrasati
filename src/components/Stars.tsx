export function Stars({ value, small = false }: { value: number; small?: boolean }) {
  const filled = Math.max(0, Math.min(3, value));
  return (
    <span className={`stars${small ? ' small' : ''}`} aria-label={`${filled} من 3 نجوم`}>
      {[0, 1, 2].map((index) => (
        <span key={index} className={index < filled ? '' : 'off'} aria-hidden="true">
          ⭐
        </span>
      ))}
    </span>
  );
}
