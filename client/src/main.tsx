import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import { Toaster } from "react-hot-toast";
import "./index.css";
import EventsPage from "./pages/events";
import CreateEventPage from "./pages/create-event";
import ViewEventPage from "./pages/view-event";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Toaster />
      <Routes>
        <Route index element={<EventsPage />} />
        <Route path="events">
          <Route path="create" element={<CreateEventPage />} />
          <Route path=":id" element={<ViewEventPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
