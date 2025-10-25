import { NavLink } from "react-router";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import Button from "../button";

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
            <NavLink to="/admin/dashboard">
              <Button color="transparent">Admin</Button>
            </NavLink>
          </li>
          <li>
            <NavLink to="/events/create">
              <Button>Criar evento</Button>
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}
