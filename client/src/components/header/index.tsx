import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

export default function Header() {
  return (
    <header className="shadow px-6 py-4">
      <nav className="max-w-7xl mx-auto flex items-center justify-between">
        <a href="/" className="flex items-center gap-1.5">
          <CalendarTodayIcon />
          <h1 className="text-xl font-semibold">EventHub</h1>
        </a>

        <ul className="gap-6 hidden sm:flex">
          <li>
            <a href="/" className="text-sm font-semibold">
              Eventos
            </a>
          </li>
          <li>
            <a href="/events/create" className="text-sm font-semibold">
              Criar evento
            </a>
          </li>
        </ul>

        <ul className="flex items-center gap-2">
          <li>
            <a
              href="/admin/dashboard"
              className="text-sm font-semibold text-center min-h-8 px-2.5 py-1.5 rounded-lg flex items-center justify-center hover:bg-neutral-100"
            >
              Admin
            </a>
          </li>
          <li>
            <a
              href="/events/create"
              className="text-white text-sm font-semibold text-center bg-black min-h-8 px-2.5 py-1.5 rounded-lg flex items-center justify-center hover:bg-neutral-800"
            >
              Criar evento
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
