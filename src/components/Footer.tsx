import { FaGithub, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-800 border-t border-gray-700 py-4">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="flex items-center gap-2">
            <img
              src="https://flagcdn.com/w40/do.png"
              alt="Dominican Republic Flag"
              className="w-6 h-4"
            />
            <span className="text-gray-300">Carlos Arias</span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://github.com/CarlosWAriasA"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <FaGithub className="w-5 h-5" />
            </a>
            <a
              href="https://linkedin.com/in/carlos-arias-929330215"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <FaLinkedin className="w-5 h-5" />
            </a>
          </div>

          <p className="text-sm text-gray-500">
            Developed with ❤️ in Dominican Republic
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
