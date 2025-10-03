import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BeforeRegister from "./Pages/BeforeRegister/BeforeRegister";
import Register from "./Pages/Register/Register";
import HomePage from './Pages/HomePage/HomePage';
import EventPage from  './Pages/EventPage/EventPage';
import CreateEvent from "./Pages/CreateEvent/CreateEvent";

function App() {
  return(
    <Router>
      <Routes>
        <Route path="/" element={<BeforeRegister />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/events" element={<EventPage />} />
        <Route path="/createEvents" element={<CreateEvent />} />
      </Routes>
    </Router>
  );
}

export default App;
