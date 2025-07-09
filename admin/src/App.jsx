import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminPage from "./pages/AdminPage";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <ToastContainer />
      <Router>
        <Routes>
        <Route path="/login" element={<h1>Login Page</h1>} />
        <Route path="/register" element={<h1>Register Page</h1>} />
        <Route path="admin/*" element={<AdminPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
