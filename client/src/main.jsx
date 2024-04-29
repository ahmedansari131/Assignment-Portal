import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,
} from "react-router-dom";
import {
  Assignments,
  Layout,
  Error404,
  Landing,
  OTP,
  Login,
  TeacherVerification,
  AssignmentDetail,
  UploadDocuments,
  AnalysisTable,
} from "./pages";
import { Provider } from "react-redux";
import { store } from "./app/store";
import PrivateRoutes from "./components/PrivateRoutes";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />} errorElement={<Error404 />}>
      <Route path="/" element={<Landing />} />
      <Route path="login" element={<Login />} />
      <Route path="login-verification" element={<OTP />} />
      <Route path="teacher-verification" element={<TeacherVerification />} />
      <Route
        path="assignments"
        element={<PrivateRoutes Components={Assignments} />}
      />
      <Route
        path="assignments/:assignmentId"
        element={<PrivateRoutes Components={AssignmentDetail} />}
      />
      <Route
        path="submissions/:assignmentId"
        element={<PrivateRoutes Components={UploadDocuments} />}
      />
      <Route
        path="assignment-analysis/:assignmentId"
        element={<PrivateRoutes Components={AnalysisTable} />}
      />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
