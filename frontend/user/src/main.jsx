import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import ErrorBoundary from "./components/ErrorBoundary";
import "./styles/index.css";
import "./styles/animations.css";

import { GoogleOAuthProvider } from "@react-oauth/google";

ReactDOM.createRoot(document.getElementById("root")).render(
 <React.StrictMode>
 <GoogleOAuthProvider clientId="220040450571-qo0mghbchv42nm97ojr009ra2k5therl.apps.googleusercontent.com">
 <ErrorBoundary>
 <App />
 </ErrorBoundary>
 </GoogleOAuthProvider>
 </React.StrictMode>,
);
