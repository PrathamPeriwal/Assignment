export function FormError({ children }: { children?: string }) {
  if (!children) return null;
  return (
    <p role="alert" className="border-l-[3px] border-vermilion pl-2 text-sm text-ink">
      {children}
    </p>
  );
}
