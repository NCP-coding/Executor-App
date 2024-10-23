
interface FooterProps {
  className?: String;
}


const Footer: React.FC<FooterProps> = ({className}) => {
    return (
      <footer className={`bg-sky-800 text-white p-4 rounded-lg ${className}`}>       
          <p className="text-sm">&copy; 2024 N.C.P. All rights reserved.</p>
      </footer>
    );
  };
  
export default Footer;