function Card({ children, className = '', onClick }) {
  return (
    <div
      onClick={onClick}
      className={`bg-spotify-elevated hover:bg-spotify-hover rounded-md p-4 transition-colors duration-200 cursor-pointer group ${className}`}
    >
      {children}
    </div>
  )
}

export default Card