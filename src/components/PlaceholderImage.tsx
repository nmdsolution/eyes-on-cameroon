import { clsx } from "clsx";

export default function PlaceholderImage({
  className,
  label,
}: {
  className?: string;
  label?: string;
}) {
  return (
    <div
      className={clsx(
        "relative bg-gradient-to-br from-green-700 via-green-600 to-green-800 flex flex-col items-center justify-center overflow-hidden",
        className
      )}
    >
      {/* Cameroon flag stripes */}
      <div className="absolute inset-0 flex flex-col">
        <div className="flex-1 bg-green-700" />
        <div className="flex-1 bg-red-700" />
        <div className="flex-1 bg-yellow-400" />
      </div>
      {/* Star */}
      <div className="relative z-10 flex flex-col items-center gap-2">
        <svg viewBox="0 0 24 24" className="w-10 h-10 fill-yellow-300 drop-shadow-md" xmlns="http://www.w3.org/2000/svg">
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
        </svg>
        {label && (
          <span className="text-white text-xs font-medium bg-black/30 px-2 py-0.5 rounded-full backdrop-blur-sm">
            {label}
          </span>
        )}
      </div>
    </div>
  );
}
