const Button = ({ children, onClick, className }) => {
  return (
    <a href="#"
      onClick={onClick}
      className={`bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors ${className}`}
    >
      {children}
    </a>
  );
};

export default Button;