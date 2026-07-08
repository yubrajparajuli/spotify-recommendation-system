function Button({ children, variant = 'primary', className = '', ...props }) {
  const base = 'rounded-full font-semibold px-6 py-2.5 text-sm transition-colors duration-150'

  const variants = {
    primary: 'bg-spotify-green text-black hover:bg-spotify-green-hover',
    secondary: 'bg-white text-black hover:scale-105',
    outline: 'border border-spotify-border text-white hover:border-white',
    ghost: 'text-spotify-text-secondary hover:text-white',
  }

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}

export default Button