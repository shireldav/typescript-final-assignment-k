import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const nav = useNavigate();
  const isLoggedIn = localStorage.getItem("token") !== null; //if token exists -> the admin is logged in

  //logout means removing the token from the browser and going to the login page
  const onLogout = () => {
    localStorage.removeItem("token");
    nav("/login");
  };


  return (
    <header className="border-b border-slate-200 bg-white">
      <nav className="mx-auto flex max-w-4xl flex-wrap items-center gap-4 px-4 py-3">
        <Link to="/" className="mr-auto text-lg font-bold text-teal-800">Ticket Desk Support </Link>
        {isLoggedIn ? (
          <>
            <Link to="/dashboard" className="hover:underline">Dashboard</Link>
            <Link to="/tickets" className="hover:underline">Tickets</Link>
            <button onClick={onLogout} className="rounded border border-slate-300 px-3 py-1 hover:bg-slate-50">
              Log out
            </button>
          </>
        ) : (
          <Link to="/login" className="hover:underline">Admin login</Link>
        )}
      </nav>
    </header>
  );
}
