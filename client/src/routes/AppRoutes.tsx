import { Route, Routes } from "react-router-dom";
import AppLayout from "../layout/AppLayout";
import SituationMainPage from "../pages/Situation/SituationMainPage";
import EditSituationPage from "../pages/Situation/EditSituationPage";
import DeleteSituationPage from "../pages/Situation/DeleteSituationPage";
import GenderMainPage from "../pages/Gender/GenderMainPage";
import EditGenderPage from "../pages/Gender/EditGenderPage";
import DeleteGenderPage from "../pages/Gender/DeleteGenderPage";
import CrisisMainPage from "../pages/Crisis/CrisisMainPage";
import EditCrisisPage from "../pages/Crisis/EditCrisisPage";
import DeleteCrisisPage from "../pages/Crisis/DeleteCrisisPage";
import UserMainPage from "../pages/User/UserMainPage";
import LoginPage from "../pages/Auth/LoginPage";
import DashMainPage from "../pages/Dashboard/DashMainPage";
import { AuthProvider } from "../contexts/AuthContext";
import ProtectedRoute from "./ProtectedRoute";
import ApplicantMainPage from "../pages/Applicant/ApplicantMainPage";
import BarangayMainPage from "../pages/Barangay/BarangayMainPage";
import EditBarangayPage from "../pages/Barangay/EditBarangayPage";
import DeleteBarangayPage from "../pages/Barangay/DeleteBarangayPage";
import EditCityPage from "../pages/City/EditCityPage";
import DeleteCityPage from "../pages/City/DeleteCityPage";
import HouseMainPage from "../pages/House/HouseMainPage"; // Assuming this page exists
import EditHousePage from "../pages/House/EditHousePage";
import DeleteHousePage from "../pages/House/DeleteHousePage";
import StreetMainPage from "../pages/Street/StreetMainPage"; // Assuming this page exists
import EditStreetPage from "../pages/Street/EditStreetPage";
import DeleteStreetPage from "../pages/Street/DeleteStreetPage";
import CityMainPage from "../pages/City/CityMainPage";

const AppRoutes = () => {
  return (
    <>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LoginPage />} />

          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<DashMainPage />} />
            <Route path="/situations" element={<SituationMainPage />} />
            <Route
              path="/situation/edit/:situation_id"
              element={<EditSituationPage />}
            />
            <Route
              path="/situation/delete/:situation_id"
              element={<DeleteSituationPage />}
            />
            <Route path="/genders" element={<GenderMainPage />} />
            <Route
              path="/gender/edit/:gender_id"
              element={<EditGenderPage />}
            />
            <Route
              path="/gender/delete/:gender_id"
              element={<DeleteGenderPage />}
            />
            <Route path="/barangays" element={<BarangayMainPage />} />
            <Route
              path="/barangay/edit/:barangay_id"
              element={<EditBarangayPage />}
            />
            <Route
              path="/barangay/delete/:barangay_id"
              element={<DeleteBarangayPage />}
            />
            <Route path="/cities" element={<CityMainPage />} />
            <Route path="/city/edit/:city_id" element={<EditCityPage />} />
            <Route path="/city/delete/:city_id" element={<DeleteCityPage />} />
            <Route path="/houses" element={<HouseMainPage />} />
            <Route path="/house/edit/:house_id" element={<EditHousePage />} />
            <Route
              path="/house/delete/:house_id"
              element={<DeleteHousePage />}
            />
            <Route path="/streets" element={<StreetMainPage />} />
            <Route
              path="/street/edit/:street_id"
              element={<EditStreetPage />}
            />
            <Route
              path="/street/delete/:street_id"
              element={<DeleteStreetPage />}
            />
            <Route path="/crisiss" element={<CrisisMainPage />} />
            <Route
              path="/crisis/edit/:crisis_id"
              element={<EditCrisisPage />}
            />
            <Route
              path="/crisis/delete/:crisis_id"
              element={<DeleteCrisisPage />}
            />
            <Route path="/users" element={<UserMainPage />} />
            <Route path="/applicants" element={<ApplicantMainPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </>
  );
};

export default AppRoutes;
