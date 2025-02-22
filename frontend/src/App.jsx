import { Routes, Route, Navigate } from "react-router-dom";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";

export default function App() {
  return (
    <div className="p-5">
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Dashboard Route */}
        <Route
          path="/"
          element={
            <SignedIn>
              <Dashboard />
            </SignedIn>
          }
        />
        
        {/* Redirect Users if Not Signed In */}
        <Route
          path="/"
          element={
            <SignedOut>
              <Navigate to="/login" />
            </SignedOut>
          }
        />
        
        {/* Redirect Unauthenticated Users from Dashboard */}
        <Route path="*" element={<RedirectToSignIn />} />
      </Routes>
    </div>
  );
}
