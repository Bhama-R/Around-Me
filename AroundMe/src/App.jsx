import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BeforeRegister from "./Pages/BeforeRegister/BeforeRegister";
import Register from "./Pages/Register/Register";
import LoginPage from "./Pages/LoginPage/LoginPage";
import HomePage from './Pages/HomePage/HomePage';
import EventPage from  './Pages/EventPage/EventPage';
import CreateEvent from "./Pages/CreateEvent/CreateEvent";
import EventDetailPage from "./Pages/EventDetails/EventDetails";
import ManageEvents from "./Pages/ManageEvents/ManageEvents";
import CategoryManagement from "./Pages/CategoryManagement/CategoryManagement";
import UserManagement from "./Pages/UserManagement/UserManagrement";
import VerifyPage from "./Pages/VerifyPage/VerifyPage";

function App() {
  return(
    <Router>
      <Routes>
        <Route path="/" element={<BeforeRegister />} />
        <Route path="/register" element={<Register />} />
         <Route path="/login" element={<LoginPage />} />
         <Route path="/users/verify/:token" element={<VerifyPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/events" element={<EventPage />} />
        <Route path="/createEvents" element={<CreateEvent />} />
         <Route path="/event/:id" element={<EventDetailPage />} />
         <Route path="/manageEvents" element={<ManageEvents />} />
         <Route path="/categoryManagement" element={<CategoryManagement />} />
         <Route path="/userManagement" element={<UserManagement />} />
      </Routes>
    </Router>
  );
}

export default App;
