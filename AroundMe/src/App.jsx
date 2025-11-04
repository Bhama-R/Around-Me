import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import BeforeRegister from "./Pages/BeforeRegister/BeforeRegister";
import Register from "./Pages/Register/Register";
import LoginPage from "./Pages/LoginPage/LoginPage";
import HomePage from "./Pages/HomePage/HomePage";
import EventPage from "./Pages/EventPage/EventPage";
import CreateEvent from "./Pages/CreateEvent/CreateEvent";
import EventDetailPage from "./Pages/EventDetails/EventDetails";
import ManageEvents from "./Pages/ManageEvents/ManageEvents";
import CategoryManagement from "./Pages/CategoryManagement/CategoryManagement";
import UserManagement from "./Pages/UserManagement/UserManagrement";
import VerifyPage from "./Pages/VerifyPage/VerifyPage";
import FakeReportManagement from "./Pages/FakeReport/FakeReport";
import MyCreatedEvents from "./Pages/MyEvents/MyEvents";
import MyInterestedEvents from "./Pages/MyInterestedEvent/MyInterestedEvents";
import AttendeeDashboard from "./Pages/AttendeeDashboard/AttendeeDashboard";
import Navbar from "./Pages/NavBar/Navbar";

function App() {
  return (
    <Router>
      <MainApp />
    </Router>
  );
}

function MainApp() {
  const location = useLocation();

  //  Hide Navbar for login/register/landing/verify routes
  const hideNavbarPaths = ["/", "/login", "/register"];
  const shouldHideNavbar =
    hideNavbarPaths.includes(location.pathname) ||
    location.pathname.startsWith("/users/verify");

  return (
    <>
      {/* ✅ Navbar visible on all routes EXCEPT login/register/verify */}
      {!shouldHideNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<BeforeRegister />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/users/verify/:token" element={<VerifyPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/events" element={<EventPage />} />
        <Route path="/createEvents" element={<CreateEvent isEditMode={false} />} />
        <Route path="/event/:id" element={<EventDetailPage />} />
        <Route path="/manageEvents" element={<ManageEvents />} />
        <Route path="/categoryManagement" element={<CategoryManagement />} />
        <Route path="/userManagement" element={<UserManagement />} />
        <Route path="/fakeReport" element={<FakeReportManagement />} />
        <Route path="/myevents" element={<MyCreatedEvents />} />
        <Route path="/attendees/:eventId" element={<AttendeeDashboard />} />
        <Route path="/myinterests" element={<MyInterestedEvents />} />
        <Route path="/editEvent/:id" element={<CreateEvent isEditMode={true} />} />

      </Routes>
    </>
  );
}

export default App;
