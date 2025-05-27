export function Button({ className = "", children, ...props }) {
    return (
      <button
        className={`w-full py-3 px-4 bg-[#D25B24] hover:bg-[#b3471c] text-white rounded-lg font-semibold transition duration-300 shadow ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
  