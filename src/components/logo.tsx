import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <svg
      className={cn("h-8 w-8 text-primary", className)}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2L2 7V17L12 22L22 17V7L12 2ZM4 8.236L12 12.53L20 8.236V15.764L12 20.06L4 15.764V8.236Z"
      />
    </svg>
  );
}
