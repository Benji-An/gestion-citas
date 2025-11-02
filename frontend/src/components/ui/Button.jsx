const Button = ({ children, onClick, className }) => {
  return (
    <a href="#"
      onClick={onClick}
      className={`bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors ${className}`}
    >
      {children}
    </a>
  );
};

export default Button;