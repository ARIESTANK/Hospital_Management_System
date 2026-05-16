import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import Users from './pages/Users';
import Reception from './pages/Reception';
import Rooms from "./pages/Rooms";

// Import your page components (assuming these files exist in your src folder)
function App() {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<Login/>} />
          <Route path="/dashboard" element={<Dashboard/>} />
          <Route path="/patients" element={<Patients/>} />
          <Route path='/users' element={<Users/>} />
          <Route path='/rooms' element={<Rooms/>} />
          <Route path='/reception' element={<Reception/>} />
        </Routes>
    </Router>
  );
}

export default App;
