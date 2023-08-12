import React, { lazy, Suspense, createContext, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import Login from "./pages/public/Login";
import Signup from "./pages/public/Signup";
import ForgotPassword from "./pages/public/ForgotPassword";
import ConOverview from "./pages/contractor/ConOverview";
import AdminOverview from "./pages/admin/AdminOverview";
import Loading from "./pages/public/Loading";
import ProtectedRoutes from "./components/authorization/ProtectedRoutes";
import "./scss/style.css";

export const UserContext = createContext();

// Code split components to load after initial bundle
const ConPaymentRequest = lazy(() =>
  import("./pages/contractor/ConPaymentRequest")
);
const ConPendingPayments = lazy(() =>
  import("./pages/contractor/ConPendingPayments")
);
const ConPaymentHistory = lazy(() =>
  import("./pages/contractor/ConPaymentHistory")
);
const ConPaymentDetail = lazy(() =>
  import("./pages/contractor/ConPaymentDetail")
);
const ConProfile = lazy(() => import("./pages/contractor/ConProfile"));
const AdminConDetail = lazy(() => import("./pages/admin/AdminConDetail"));

const AdminPendingPayments = lazy(() =>
  import("./pages/admin/AdminPendingPayments")
);
const AdminScheduledPayments = lazy(() =>
  import("./pages/admin/AdminScheduledPayments")
);
const AdminPaymentDetail = lazy(() =>
  import("./pages/admin/AdminPaymentDetail")
);
const AdminPendingDetail = lazy(() =>
  import("./pages/admin/AdminPendingDetail")
);
const AdministratorDetail = lazy(() =>
  import("./pages/admin/AdministratorDetail")
);
const AdminPaymentHistory = lazy(() =>
  import("./pages/admin/AdminPaymentHistory")
);
const Administrators = lazy(() => import("./pages/admin/Administrators"));
const AdminContractors = lazy(() => import("./pages/admin/AdminContractors"));
const AddAdmin = lazy(() => import("./pages/admin/AddAdmin"));

function App() {
  const [userProfilePhoto, setUserProfilePhoto] = useState();
  return (
    <div className="App">
      <UserContext.Provider value={{ userProfilePhoto, setUserProfilePhoto }}>
        <BrowserRouter>
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route path="/">
                <Route index element={<Login />} />
              </Route>
              <Route path="/signup">
                <Route index element={<Signup />} />
              </Route>
              <Route path="/reset-password">
                <Route index element={<ForgotPassword />} />
              </Route>
              <Route element={<ProtectedRoutes accountType="contractor" />}>
                <Route path="/contractor" element={<AppLayout />}>
                  <Route index element={<ConOverview />} />
                  <Route
                    path="payment-request-form"
                    element={<ConPaymentRequest />}
                  />
                  <Route
                    path="pending-payments"
                    element={<ConPendingPayments />}
                  />
                  <Route
                    path="payment-history"
                    element={<ConPaymentHistory />}
                  />
                  <Route path="payment-detail" element={<ConPaymentDetail />} />
                  <Route path="profile" element={<ConProfile />} />
                </Route>
              </Route>
              <Route path="/admin" element={<AppLayout />}>
                <Route element={<ProtectedRoutes accountType="admin" />}>
                  <Route index element={<AdminOverview />} />
                  <Route path="contractors" element={<AdminContractors />} />
                  <Route
                    path="pending-payments"
                    element={<AdminPendingPayments />}
                  />
                  <Route
                    path="scheduled-payments"
                    element={<AdminScheduledPayments />}
                  />
                  <Route
                    path="payment-history"
                    element={<AdminPaymentHistory />}
                  />
                  <Route
                    path="contractor-detail"
                    element={<AdminConDetail />}
                  />
                  <Route
                    path="payment-detail"
                    element={<AdminPaymentDetail />}
                  />
                  <Route
                    path="pending-detail"
                    element={<AdminPendingDetail />}
                  />
                </Route>
                <Route element={<ProtectedRoutes accountType="superAdmin" />}>
                  <Route path="administrators" element={<Administrators />} />
                  <Route path="add-administrator" element={<AddAdmin />} />
                  <Route
                    path="administrator-detail"
                    element={<AdministratorDetail />}
                  />
                </Route>
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
      </UserContext.Provider>
    </div>
  );
}

export default App;
