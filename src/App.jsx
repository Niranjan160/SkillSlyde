import {  Route,  createBrowserRouter,  createRoutesFromElements,  RouterProvider,} from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import JobsPage from "./pages/JobsPage";
import NotFoundPage from "./pages/NotFoundPage";
import PostJob from "./pages/PostJob";
import EditJobPage, { jobLoader } from "./pages/EditJobPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import MessagesPage from "./pages/MessagePage";
import ChatPage from "./pages/ChatPage";
// import SettingsPage from "./pages/SettingsPage";
import NotificationPage from './pages/NotificationPage';
// import AddressForm from './components/AddressForm';
import ApplicationsPage from "./pages/ApplicationsPage";
import { API_BASE_URL } from "./CONSTANTS";


const App = () => {
  const userId = localStorage.getItem("userId")

  // Add new job
  const addJob = async (newJob) => {
    await fetch(`${API_BASE_URL}/api/jobs/post`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newJob),
    });
  };

  // Delete a job
  const deleteJob = async (id) => {
    await fetch(`${API_BASE_URL}/api/jobs/${id}`, {
      method: "DELETE",
    });
  };

  // Update a job
  const updateJob = async (job) => {
    await fetch(`${API_BASE_URL}/api/jobs/${job.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(job),
    });
  };

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="jobs" element={<JobsPage />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="profile" element={<Profile userId={userId}/>} />
        {/* <Route path="/settings" element={<SettingsPage />} /> */}
        <Route path="messages" element={<MessagesPage />} />
        <Route path="chat/:userId" element={<ChatPage />} />
        <Route path="/add-job" element={<PostJob addJob={addJob} userId={userId}/>} />
        <Route path="/notifications" element={<NotificationPage />} />
        <Route path="/applications" element={<ApplicationsPage />} />

        <Route
          path="edit-job/:id"
          element={<EditJobPage updateJobSubmit={updateJob} />}
          loader={jobLoader}
        />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    )
  );

  return (
    <>
      <RouterProvider router={router} />
      {/* <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <AddressForm />
    </div> */}
    </>
    
  );
};

export default App;