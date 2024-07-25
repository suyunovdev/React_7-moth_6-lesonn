import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import Login from "./components/Login";
import Teacher from "./components/Teacher";
import Students from "./components/Students";
import Profil from "./components/Profil";
const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/teacher" element={<Teacher />} />
          <Route path="/students" element={<Students />} />
          <Route path="/profil" element={<Profil />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
