
import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import { RealtimeProvider } from "./app/contexts/RealtimeContext.tsx";
import { AppProvider } from "./app/contexts/AppProvider.tsx";
import "./styles/index.css";

createRoot(document.getElementById("root")!).render(
  <AppProvider>
    <RealtimeProvider>
      <App />
    </RealtimeProvider>
  </AppProvider>
);
