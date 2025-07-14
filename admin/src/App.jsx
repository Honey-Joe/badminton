import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminPage from "./pages/AdminPage";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import { useEffect } from "react";
import {useDispatch} from "react-redux"
import { getMe } from "./services/api";
import { setCredentials } from "./store/authSlice";
function App() {
  const [count, setCount] = useState(0);
  const dispatch = useDispatch()

  useEffect(()=>{
      const fetchUser = async () => {
        try {
          const response = await getMe();
          console.log(response)
          dispatch(setCredentials({
            user: response.data,
            token:response.data
          }));
        } catch (error) {
          console.error('Failed to fetch user:', error);
        }
      };
      fetchUser();
    })

  return (

    
    <>
      <ToastContainer />
      <Router>
        <Routes>
          <Route path="/" element={<Home></Home>}></Route>
        <Route path="/login" element={<Login></Login>} />
        <Route path="/register" element={<h1>Register Page</h1>} />
        <Route path="admin/*" element={<AdminPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
