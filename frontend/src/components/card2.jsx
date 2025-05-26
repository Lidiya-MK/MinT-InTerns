export function Card({ className = "", children }) {
    return (
      <div className={`rounded-2xl border bg-white p-6 shadow-md ${className}`}>
        {children}
      </div>
    );
  }
  
  export function CardContent({ className = "", children }) {
    return <div className={`space-y-4 ${className}`}>{children}</div>;
  }
  