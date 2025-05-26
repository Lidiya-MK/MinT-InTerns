export function Input({ className = "", ...props }) {
    return (
      <input
        className={`w-full p-3 rounded-lg border bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-orange-500 ${className}`}
        {...props}
      />
    );
  }
  