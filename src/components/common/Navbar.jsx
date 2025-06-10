import { House } from "lucide-react";
import { Link } from "react-router-dom";

function Navbar({ role }) {
  return (
    <nav className="fixed w-full bg-fourth p-3">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-white text-xl font-bold">Event Management</h1>
        <div>
          <Link to="/" className="text-first px-4 flex">
          <House className="inline m-1" size={18}/>
            <p>Home</p>
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
