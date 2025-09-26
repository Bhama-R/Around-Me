import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from './Pages/HomePage';
import EventPage from  './Pages/EventPage';
import CreateEvent from "./Pages/CreateEvent";

function App() {
  return(
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/events" element={<EventPage />} />
        <Route path="/createEvents" element={<CreateEvent />} />
      </Routes>
    </Router>
  );
}

export default App;
