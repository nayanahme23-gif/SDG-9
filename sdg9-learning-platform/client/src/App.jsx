import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Dashboard from './pages/Dashboard';
import CrackAnalysis from './pages/CrackAnalysis';
import CourseList from './pages/Courses/CourseList';
import CreateCourse from './pages/Courses/CreateCourse';
import EditCourse from './pages/Courses/EditCourse';
import CourseDetail from './pages/Courses/CourseDetail';
import ProjectList from './pages/Projects/ProjectList';
import CreateProject from './pages/Projects/CreateProject';
import ProjectDetail from './pages/Projects/ProjectDetail';
import Home from './pages/Home';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900 font-sans text-gray-100">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/crack-analysis" element={<CrackAnalysis />} />
            <Route path="/courses" element={<CourseList />} />
            <Route path="/courses/create" element={<CreateCourse />} />
            <Route path="/courses/edit/:id" element={<EditCourse />} />
            <Route path="/courses/:id" element={<CourseDetail />} />
            <Route path="/projects" element={<ProjectList />} />
            <Route path="/projects/create" element={<CreateProject />} />
            <Route path="/projects/:id" element={<ProjectDetail />} />
            <Route path="/" element={<Home />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
