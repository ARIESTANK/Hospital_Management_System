import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";

// Import your page components (assuming these files exist in your src folder)
function App() {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<Login/>} />
          <Route path="/dashboard" element={<Dashboard/>} />
          <Route path="/patients" element={<Patients/>} />
        </Routes>
    </Router>
  );
}

export default App;
