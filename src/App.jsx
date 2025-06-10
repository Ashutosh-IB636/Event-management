import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signin from './components/Signin';
import AdminPage from './pages/AdminPage';
import EmployeePage from './pages/EmployeePage';
import NotFound from './pages/NotFound';
import Navbar from './components/common/Navbar';
import EventDetails from './components/EventDetails';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Signin />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/employee/:id" element={<EmployeePage />} />
        <Route path="/events/:eventId" element={<EventDetails />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;