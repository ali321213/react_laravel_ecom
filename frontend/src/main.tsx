// This is the main entry file for the React app.
// It finds the <div id="root"> in index.html and mounts the whole React application there.

import React from "react";
import ReactDOM from "react-dom/client";

// Provider from react-redux gives ALL components access to the Redux store.
import { Provider } from "react-redux";
import { store } from "./app/store";

// QueryClientProvider gives access to React Query (used for data fetching/caching).
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// The top-level React component for your app.
import App from "./App";

// Global CSS for the app (Tailwind + custom styles).
import "./index.css";

// React Query "client" object that tracks all queries (products, etc.).
const queryClient = new QueryClient();

// Create a React root and render the app.
ReactDOM.createRoot(document.getElementById("root")!).render(
  // StrictMode helps find potential problems in development (it does nothing in production).
  <React.StrictMode>
    {/* Make Redux store available to all components */}
    <Provider store={store}>
      {/* Make React Query available to all components */}
      <QueryClientProvider client={queryClient}>
        {/* Render the main App component */}
        <App />
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>,
);
