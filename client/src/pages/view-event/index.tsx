import { QueryClientProvider } from "@tanstack/react-query";
import { Link } from "react-router";
import WestIcon from "@mui/icons-material/West";
import queryClient from "../../api/query-client";
import Header from "../../components/header";
import ViewEvent from "../../components/view-event";

export default function ViewEventPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <section>
        <Header />
        <main className="max-w-4xl p-6 mx-auto">
          <Link
            to="/"
            className="text-neutral-600 text-sm mb-6 flex items-center gap-2 transition-colors hover:text-black"
          >
            <WestIcon fontSize="inherit" />
            <span>Voltar para eventos</span>
          </Link>
          <ViewEvent />
        </main>
      </section>
    </QueryClientProvider>
  );
}
