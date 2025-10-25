import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import "./index.css";
import EventsPage from "./pages/events";
import CreateEventPage from "./pages/create-event";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route index element={<EventsPage />} />
        <Route path="events">
          <Route path="create" element={<CreateEventPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
