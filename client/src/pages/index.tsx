import { QueryClientProvider } from "@tanstack/react-query";
import Events from "../components/events";
import Header from "../components/header";
import queryClient from "../api/query-client";

export default function EventsPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <section>
        <Header />
        <main className="max-w-7xl p-6 mx-auto">
          <Events />
        </main>
      </section>
    </QueryClientProvider>
  );
}
