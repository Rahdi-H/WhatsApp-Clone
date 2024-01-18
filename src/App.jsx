import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import Home from "./components/Home";
import Chat from "./components/Chat";
import { useEffect, useState } from "react";
import LoginPage from "./components/LoginPage";
import supabase from "./supabseConfig";

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')))
  
  return (
    <>
      <Router>
          {user ? 
        <Routes>
          <Route path="/" element={<Home user={user}/>} />
          <Route path="/:id" element={<Chat user={user}/>} />
        </Routes>
        : <LoginPage setUser={setUser} user={user}/>}
      </Router>
    </>
  )
}

export default App
