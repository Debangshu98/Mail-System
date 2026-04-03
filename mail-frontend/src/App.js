import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Inbox from "./pages/Inbox";
import Form from "./pages/Credentials";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Form isSignInPage />} />
        <Route path="/signup" element={<Form />} />
        <Route path="/inbox" element={<Inbox />} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
