<<<<<<< HEAD
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { ClerkProvider } from '@clerk/clerk-react'; // Import ClerkProvider

// Get the Clerk publishable key from environment variables
const clerkPubKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;
console.log('Clerk Publishable Key:', process.env.REACT_APP_CLERK_PUBLISHABLE_KEY);

// Create a root for rendering the app
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the app wrapped with ClerkProvider
root.render(
  <React.StrictMode>
    <ClerkProvider publishableKey={clerkPubKey}>
      <App />
    </ClerkProvider>
  </React.StrictMode>
);
=======
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import App from "./App";
import "./index.css";

const clerkFrontendApi = "pk_test_dG91Z2gtbWFncGllLTg2LmNsZXJrLmFjY291bnRzLmRldiQ"; // Replace with your Clerk Frontend API Key

ReactDOM.createRoot(document.getElementById("root")).render(
  <ClerkProvider publishableKey={clerkFrontendApi}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ClerkProvider>
);
>>>>>>> 968dcd3 (commited)
