import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "../../api/query-client";
import Header from "../../components/header";
import BackButton from "../../components/back-button";
import CreateEvent from "../../components/create-event";

export default function CreateEventPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <section>
        <Header />
        <main className="max-w-4xl p-6 mx-auto">
          <BackButton to="/" message="Voltar para eventos" />
          <CreateEvent />
        </main>
      </section>
    </QueryClientProvider>
  );
}
