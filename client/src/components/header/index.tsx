import { NavLink } from "react-router";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

export default function Header() {
  return (
    <header className="bg-white shadow px-6 py-4 sticky top-0">
      <nav className="max-w-7xl mx-auto flex items-center justify-between">
        <NavLink to="/" className="flex items-center gap-1.5">
          <CalendarTodayIcon />
          <h1 className="text-xl font-semibold">EventHub</h1>
        </NavLink>

        <ul className="gap-6 hidden sm:flex">
          <li>
            <NavLink to="/" className="text-sm font-semibold">
              Eventos
            </NavLink>
          </li>
          <li>
            <NavLink to="/events/create" className="text-sm font-semibold">
              Criar evento
            </NavLink>
          </li>
        </ul>

        <ul className="flex items-center gap-2">
          <li>
            <NavLink
              to="/admin/dashboard"
              className="text-sm font-semibold text-center min-h-8 px-2.5 py-1.5 rounded-lg flex items-center justify-center hover:bg-neutral-100"
            >
              Admin
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/events/create"
              className="text-white text-sm font-semibold text-center bg-black min-h-8 px-2.5 py-1.5 rounded-lg flex items-center justify-center hover:bg-neutral-800"
            >
              Criar evento
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}
