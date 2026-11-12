import { Routes, Route } from 'react-router-dom';
import Register from './admin/Authentication/Register.jsx';
import Login from './admin/Authentication/Login.jsx';
import ProtectedRoute from './admin/Authentication/ProtectedRoute.jsx';
import AdminDashboard from './admin/Dashboard/AdminDashboard.jsx';
import CreateEvent from './admin/EvenManagement/CreateEvent';
import DeleteEvent from './admin/EvenManagement/DelateEvents';
import EditEvents from './admin/EvenManagement/EditEvents';
import ManageEvents from './admin/EvenManagement/ManageEvent';
import PublicEvent from './pages/PublicEvent.jsx';
import Homepage from './pages/hompage.jsx';
import AddAdmin from './admin/AdminManagement/AddAdmin.jsx';
import ManageAdmin from './admin/AdminManagement/ManageAdmin.jsx';
import ChangePassword from './admin/Authentication/ChangePassword.jsx';
import ForgotPassword from './admin/Authentication/ForgotPassword.jsx';
import ResetPassword from './admin/Authentication/ResetPassword.jsx';
import AboutUs from './pages/AboutUs.jsx';
import OurService from './pages/Ourservice.jsx';
import CreateDirectorate from './admin/Directorates/CreateDirectorate.jsx';
import EditDirectorate from './admin/Directorates/EditDirectorate.jsx';
import DirectorateList from './admin/Directorates/DirectorateList.jsx';
import DirectorateDetails from './admin/Directorates/DirectorateDetails.jsx';
import DeleteDirectorate from './admin/Directorates/DeleteDirectorate.jsx';
import CitzenList from './admin/Citizens/CitizenList.jsx';
import CitizenDetails from './admin/Citizens/CitizenDetails.jsx';
import ComplaintList from './admin/Complaints/ComplaintList.jsx';
import ComplaintDetails from './admin/Complaints/ComplaintDetails.jsx';
import CreateRestRequest from './admin/RestRequests/CreateRestRequest.jsx';
import MyRestRequests from './admin/RestRequests/MyRestRequests.jsx';
import RestRequestList from './admin/RestRequests/RestRequestList.jsx';
import RestRequestDetails from './admin/RestRequests/RestRequestDetails.jsx';
import ServiceRequestList from './admin/ServiceRequests/ServiceRequestList.jsx';
import ServiceRequestDetails from './admin/ServiceRequests/ServiceRequestDetails.jsx';
import AddStaff from './admin/Staff/AddStaff.jsx';
import EditStaff from './admin/Staff/EditStaff.jsx';
import StaffList from './admin/Staff/StaffList.jsx';
import DeleteStaff from './admin/Staff/DeleteStaff.jsx';
import CreateTask from './admin/Tasks/CreateTask.jsx';
import EditTask from './admin/Tasks/EditTask.jsx';
import TaskDetails from './admin/Tasks/TaskDetails.jsx';
import TaskList from './admin/Tasks/TaskList.jsx';
import CreateWorkPlan from './admin/WorkPlans/CreateWorkPlan.jsx';
import EditWorkPlan from './admin/WorkPlans/EditWorkPlan.jsx';
import WorkPlanDetails from './admin/WorkPlans/WorkPlanDetails.jsx';
import WorkPlanList from './admin/WorkPlans/WorkPlanList.jsx';
import CitizenLogin from './citizensAuth/CitizenLogin.jsx';
import CitizenRegister from './citizensAuth/CitizenRegister.jsx';
import CitizenProfile from './citizensAuth/CitizenProfile.jsx';
import CitizenProtectedRoute from './citizensAuth/CitizenProtectedRoute.jsx';
import CitizenPortal from './citizensAuth/CitizenPortal.jsx';
import CitizensCompliant from './citizensAuth/CitizensCompliant.jsx';
import CitizensServiceRequest from './citizensAuth/CitizensServiceRequest.jsx';
function App() {
  return (
    <Routes>
      <Route path="/about" element={<AboutUs />} />
      <Route path="/services" element={<OurService />} />
      <Route path="/" element={<Homepage />} />
      <Route path="/home" element={<Homepage />} />
      <Route path="/events" element={<PublicEvent />} />
      <Route path="/admin/login" element={<Login />} />
      <Route path="/admin/register" element={<Register />} />
      <Route path="/citizen/login" element={<CitizenLogin />} />
      <Route path="/citizen/register" element={<CitizenRegister />} />
      <Route
        path="/citizen/portal"
        element={
          <CitizenProtectedRoute>
            <CitizenPortal />
          </CitizenProtectedRoute>
        }
      />
      <Route
        path="/citizen/complaints"
        element={
          <CitizenProtectedRoute>
            <CitizensCompliant />
          </CitizenProtectedRoute>
        }
      />
      <Route
        path="/citizen/service-requests"
        element={
          <CitizenProtectedRoute>
            <CitizensServiceRequest />
          </CitizenProtectedRoute>
        }
      />
      <Route
        path="/citizen/profile"
        element={
          <CitizenProtectedRoute>
            <CitizenProfile />
          </CitizenProtectedRoute>
        }
      />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/admin/events/create" element={
        <ProtectedRoute>
          <CreateEvent />
        </ProtectedRoute>
      } />
      <Route path="/admin/events/edit/:id" element={
        <ProtectedRoute>
          <EditEvents />
        </ProtectedRoute>
      } />
      <Route path="/admin/events/delete" element={
        <ProtectedRoute>
          <DeleteEvent />
        </ProtectedRoute>
      } />
      <Route path="/admin/citizens" element={
        <ProtectedRoute requireSuperAdmin>
          <CitzenList />
        </ProtectedRoute>
      } />
      <Route path="/admin/citizens/:id" element={
        <ProtectedRoute requireSuperAdmin>
          <CitizenDetails />
        </ProtectedRoute>
      } />
      <Route path="/admin/complaints" element={
        <ProtectedRoute requireSuperAdmin>
          <ComplaintList />
        </ProtectedRoute>
      } />
      <Route path="/admin/complaints/:id" element={
        <ProtectedRoute requireSuperAdmin>
          <ComplaintDetails />
        </ProtectedRoute>
      } />
      <Route path="/admin/rest-requests" element={
        <ProtectedRoute requireSuperAdmin>
          <RestRequestList />
        </ProtectedRoute>
      } />
      <Route path="/admin/rest-requests/create" element={
        <ProtectedRoute>
          <CreateRestRequest />
        </ProtectedRoute>
      } />
      <Route path="/admin/rest-requests/:id" element={
        <ProtectedRoute>
          <RestRequestDetails />
        </ProtectedRoute>
      } />
      <Route path="/admin/my-rest-requests" element={
        <ProtectedRoute>
          <MyRestRequests />
        </ProtectedRoute>
      } />
      <Route path="/admin/service-requests" element={
        <ProtectedRoute requireSuperAdmin>
          <ServiceRequestList />
        </ProtectedRoute>
      } />
      <Route path="/admin/service-requests/:id" element={
        <ProtectedRoute requireSuperAdmin>
          <ServiceRequestDetails />
        </ProtectedRoute>
      } />
      <Route path="/admin/staff" element={
        <ProtectedRoute>
          <StaffList />
        </ProtectedRoute>
      } />
      <Route path="/admin/staff/add" element={
        <ProtectedRoute requireSuperAdmin>
          <AddStaff />
        </ProtectedRoute>
      } />
      <Route path="/admin/staff/edit/:id" element={
        <ProtectedRoute requireSuperAdmin>
          <EditStaff />
        </ProtectedRoute>
      } />
      <Route path="/admin/staff/delete/:id" element={
        <ProtectedRoute requireSuperAdmin>
          <DeleteStaff />
        </ProtectedRoute>
      } />
      <Route path="/admin/tasks" element={
        <ProtectedRoute requireSuperAdmin>
          <TaskList />
        </ProtectedRoute>
      } />
      <Route path="/admin/tasks/create" element={
        <ProtectedRoute requireSuperAdmin>
          <CreateTask />
        </ProtectedRoute>
      } />
      <Route path="/admin/tasks/edit/:id" element={
        <ProtectedRoute requireSuperAdmin>
          <EditTask />
        </ProtectedRoute>
      } />
      <Route path="/admin/tasks/:id" element={
        <ProtectedRoute requireSuperAdmin>
          <TaskDetails />
        </ProtectedRoute>
      } />
      <Route path="/admin/work-plans" element={
        <ProtectedRoute>
          <WorkPlanList />
        </ProtectedRoute>
      } />
      <Route path="/admin/work-plans/create" element={
        <ProtectedRoute>
          <CreateWorkPlan />
        </ProtectedRoute>
      } />
      <Route path="/admin/work-plans/edit/:id" element={
        <ProtectedRoute>
          <EditWorkPlan />
        </ProtectedRoute>
      } />
      <Route path="/admin/work-plans/:id" element={
        <ProtectedRoute>
          <WorkPlanDetails />
        </ProtectedRoute>
      } />
      <Route path="/admin/directorates" element={
        <ProtectedRoute>
          <DirectorateList />
        </ProtectedRoute>
      } />
      <Route path="/admin/directorates/:id" element={
        <ProtectedRoute>
          <DirectorateDetails />
        </ProtectedRoute>
      } />
      <Route path="/admin/directorates/edit/:id" element={
        <ProtectedRoute requireSuperAdmin>
          <EditDirectorate />
        </ProtectedRoute>
      } />
      <Route path="/admin/directorates/delete/:id" element={
        <ProtectedRoute requireSuperAdmin>
          <DeleteDirectorate />
        </ProtectedRoute>
      } />
      <Route
        path="/admin/events"
        element={
          <ProtectedRoute>
            <ManageEvents />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/admins/create"
        element={
          <ProtectedRoute requireSuperAdmin>
            <AddAdmin />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/admins"
        element={
          <ProtectedRoute requireSuperAdmin>
            <ManageAdmin />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/directorates/create"
        element={
          <ProtectedRoute requireSuperAdmin>
            <CreateDirectorate />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/change-password"
        element={
          <ProtectedRoute>
            <ChangePassword />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/admin/forgot-password"
         element={<ForgotPassword />}
      />
      <Route
         path="/admin/reset-password"
         element={<ResetPassword />}
      />
    </Routes>
  );
}

export default App;