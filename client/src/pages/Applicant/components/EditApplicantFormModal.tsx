import { useEffect, useState, type FC, type FormEvent } from "react";
import type {
  ApplicantColumns,
  ApplicantFieldErrors,
} from "../../../interfaces/ApplicantInterface";
import type { GenderColumns } from "../../../interfaces/GenderInterface";
import type { CrisisColumns } from "../../../interfaces/CrisisInterface";
import type { SituationColumns } from "../../../interfaces/SituationInterface";
import type { HouseColumns } from "../../../interfaces/HouseInterface";
import type { StreetColumns } from "../../../interfaces/StreetInterface";
import type { BarangayColumns } from "../../../interfaces/BarangayInterface";
import type { CityColumns } from "../../../interfaces/CityInterface";
import GenderService from "../../../services/GenderService";
import crisisService from "../../../services/CrisisService";
import SituationService from "../../../services/SituationService";
import HouseService from "../../../services/HouseService";
import StreetService from "../../../services/StreetService";
import BarangayService from "../../../services/BarangayService";
import CityService from "../../../services/CityService";
import ApplicantService from "../../../services/ApplicantService";
import Modal from "../../../components/Modal";
import FloatingLabelInput from "../../../components/Input/FloatingLabelInput";
import FloatingLabelSelect from "../../../components/Select/FloatingLabelSelect";
import CloseButton from "../../../components/Button/CloseButton";
import SubmitButton from "../../../components/Button/SubmitButton";
import UploadFileInput from "../../../components/Input/UploadFileInput";

interface EditApplicantFormModalProps {
  applicant: ApplicantColumns | null;
  isOpen: boolean;
  onClose: () => void;
  onApplicantUpdated: (message: string) => void;
  refreshKey: () => void;
}

const EditApplicantFormModal: FC<EditApplicantFormModalProps> = ({
  applicant,
  isOpen,
  onClose,
  onApplicantUpdated,
  refreshKey,
}) => {
  // State for Personal Details
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [suffixName, setSuffixName] = useState("");
  const [genderId, setGenderId] = useState("");
  const [genders, setGenders] = useState<GenderColumns[]>([]);
  const [loadingGenders, setLoadingGenders] = useState(false);
  const [birthDate, setBirthDate] = useState("");

  // State for Contact Information
  const [contactNumber, setContactNumber] = useState("");
  const [gmail, setGmail] = useState("");
  const [houseId, setHouseId] = useState("");
  const [houses, setHouses] = useState<HouseColumns[]>([]);
  const [loadingHouses, setLoadingHouses] = useState(false);

  const [streetId, setStreetId] = useState("");
  const [streets, setStreets] = useState<StreetColumns[]>([]);
  const [loadingStreets, setLoadingStreets] = useState(false);

  const [barangayId, setBarangayId] = useState("");
  const [barangays, setBarangays] = useState<BarangayColumns[]>([]);
  const [loadingBarangays, setLoadingBarangays] = useState(false);

  const [cityId, setCityId] = useState("");
  const [cities, setCities] = useState<CityColumns[]>([]);
  const [loadingCities, setLoadingCities] = useState(false);

  // State for Crisis Information
  const [crisisId, setCrisisId] = useState("");
  const [crisiss, setCrisiss] = useState<CrisisColumns[]>([]);
  const [loadingCrisiss, setLoadingCrisiss] = useState(false);
  const [incidentDate, setIncidentDate] = useState("");
  const [situationId, setSituationId] = useState("");
  const [situations, setSituations] = useState<SituationColumns[]>([]);
  const [loadingSituations, setLoadingSituations] = useState(false);
  // State for Attached File (for editing)
  const [existingAttachedFileUrl, setExistingAttachedFileUrl] = useState<
    string | null
  >(null); // Corrected: Initialized as nullable
  const [newAttachedFile, setNewAttachedFile] = useState<File | null>(null);
  const [removeExistingFile, setRemoveExistingFile] = useState(false);

  // General form submission loading and errors
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [errors, setErrors] = useState<ApplicantFieldErrors>({});
  const [submissionMessage, setSubmissionMessage] = useState<string | null>(
    null
  );

  // --- Data Loading Functions ---
  const handleLoadGenders = async () => {
    try {
      setLoadingGenders(true);
      const res = await GenderService.loadGenders();
      if (res.status === 200) {
        setGenders(res.data.genders);
      }
    } catch (error) {
      console.error("Error loading genders:", error);
    } finally {
      setLoadingGenders(false);
    }
  };

  const handleLoadCrisiss = async () => {
    try {
      setLoadingCrisiss(true);
      const res = await crisisService.loadCrisiss();
      if (res.status === 200) {
        setCrisiss(res.data.crisiss);
      }
    } catch (error) {
      console.error("Error loading crisiss:", error);
    } finally {
      setLoadingCrisiss(false);
    }
  };

  const handleLoadSituations = async () => {
    try {
      setLoadingSituations(true);
      const res = await SituationService.loadSituations();
      if (res.status === 200) {
        setSituations(res.data.situations);
      }
    } catch (error) {
      console.error("Error loading situations:", error);
    } finally {
      setLoadingSituations(false);
    }
  };

  const handleLoadHouses = async () => {
    try {
      setLoadingHouses(true);
      const res = await HouseService.loadHouses();
      if (res.status === 200) {
        setHouses(res.data.houses);
      }
    } catch (error) {
      console.error("Error loading houses:", error);
    } finally {
      setLoadingHouses(false);
    }
  };

  const handleLoadStreets = async () => {
    try {
      setLoadingStreets(true);
      const res = await StreetService.loadStreets();
      if (res.status === 200) {
        setStreets(res.data.streets);
      }
    } catch (error) {
      console.error("Error loading streets:", error);
    } finally {
      setLoadingStreets(false);
    }
  };

  const handleLoadBarangays = async () => {
    try {
      setLoadingBarangays(true);
      const res = await BarangayService.loadBarangays();
      if (res.status === 200) {
        setBarangays(res.data.barangays);
      }
    } catch (error) {
      console.error("Error loading barangays:", error);
    } finally {
      setLoadingBarangays(false);
    }
  };

  const handleLoadCities = async () => {
    try {
      setLoadingCities(true);
      const res = await CityService.loadCitys();
      if (res.status === 200) {
        setCities(res.data.citys);
      }
    } catch (error) {
      console.error("Error loading cities:", error);
    } finally {
      setLoadingCities(false);
    }
  };

  // Effect to load dropdown data when modal opens
  useEffect(() => {
    if (isOpen) {
      handleLoadGenders();
      handleLoadCrisiss();
      handleLoadSituations();
      handleLoadHouses();
      handleLoadStreets();
      handleLoadBarangays();
      handleLoadCities();
      setErrors({}); // Clear errors on open
      setSubmissionMessage(null); // Clear submission messages on open
    }
  }, [isOpen]);

  // Effect to populate form fields when applicant data changes or modal opens
  useEffect(() => {
    if (isOpen && applicant) {
      setLastName(applicant.last_name || "");
      setFirstName(applicant.first_name || "");
      setMiddleName(applicant.middle_name || "");
      setSuffixName(applicant.suffix_name || "");
      setGenderId(applicant.gender ? String(applicant.gender.gender_id) : "");
      setBirthDate(
        applicant.birth_date ? applicant.birth_date.split("T")[0] : "" // Format date for input
      );

      setContactNumber(applicant.contact_number || "");
      setGmail(applicant.gmail || "");
      setHouseId(
        applicant.house?.house_id ? String(applicant.house.house_id) : ""
      ); // Convert to string
      setStreetId(
        applicant.street?.street_id ? String(applicant.street.street_id) : ""
      ); // Convert to string
      setBarangayId(
        applicant.barangay?.barangay_id
          ? String(applicant.barangay.barangay_id)
          : ""
      ); // Convert to string
      setCityId(applicant.city?.city_id ? String(applicant.city.city_id) : ""); // Convert to string

      setCrisisId(applicant.crisis ? String(applicant.crisis.crisis_id) : "");
      setIncidentDate(
        applicant.incident_date ? applicant.incident_date.split("T")[0] : "" // Format date for input
      );
      // Corrected: Access situation_id from the nested situation object with null checking
      setSituationId(
        applicant.situation ? String(applicant.situation.situation_id) : ""
      );

      // FIX: Use applicant.attached_file which is the filename from the model
      setExistingAttachedFileUrl(applicant.attached_file || null);
      setNewAttachedFile(null); // Clear any previously selected new file
      setRemoveExistingFile(false); // Reset remove flag
    } else if (!isOpen) {
      // Reset all states when modal closes
      setLastName("");
      setFirstName("");
      setMiddleName("");
      setSuffixName("");
      setGenderId("");
      setBirthDate("");
      setContactNumber("");
      setGmail("");
      setHouseId(""); // Reset houseId
      setStreetId(""); // Reset streetId
      setBarangayId(""); // Reset barangayId
      setCityId(""); // Reset cityId
      setCrisisId("");
      setIncidentDate("");
      setSituationId("");
      setExistingAttachedFileUrl(null); // Reset to null
      setNewAttachedFile(null);
      setRemoveExistingFile(false);
      setErrors({});
      setSubmissionMessage(null);
    }
  }, [isOpen, applicant]);

  // --- Form Submission Handler ---
  const handleUpdateApplicant = async (e: FormEvent) => {
    e.preventDefault();

    if (!applicant) {
      setSubmissionMessage("Error: No applicant data provided for update.");
      return;
    }

    setLoadingUpdate(true);
    setErrors({});
    setSubmissionMessage(null);

    try {
      const formData = new FormData();
      formData.append("_method", "PUT"); // Required for Laravel PUT/PATCH requests with FormData

      // Append file handling fields
      if (newAttachedFile) {
        formData.append("edit_applicant_file", newAttachedFile);
        formData.append("remove_attached_file", "0"); // If a new file is uploaded, don't remove existing explicitly
      } else if (removeExistingFile && existingAttachedFileUrl) {
        // Only send remove flag if there was an existing file
        formData.append("remove_attached_file", "1");
      } else {
        // If no new file and no removal, but there was an existing file,
        // pass its name so the mock can return it.
        // In a real backend, this wouldn't be necessary as it would retain the value.
        // This is a mock-specific workaround.
        if (applicant.attached_file) {
          formData.append("original_attached_file", applicant.attached_file);
        }
      }

      // Personal Details
      formData.append("first_name", firstName);
      formData.append("middle_name", middleName || "");
      formData.append("last_name", lastName);
      formData.append("suffix_name", suffixName || "");
      formData.append("birth_date", birthDate);
      formData.append("gender_id", genderId); // Use gender_id

      // Contact Information
      formData.append("contact_number", contactNumber);
      formData.append("gmail", gmail);
      formData.append("house_id", houseId); // Use house_id
      formData.append("street_id", streetId); // Use street_id
      formData.append("barangay_id", barangayId); // Use barangay_id
      formData.append("city_id", cityId); // Use city_id

      // Crisis Details
      formData.append("crisis_id", crisisId); // Use crisis_id
      formData.append("incident_date", incidentDate);
      formData.append("situation_id", situationId);

      // Calculate age for backend if needed (based on previous crisis form logic)
      if (birthDate) {
        const today = new Date();
        const birthDateObj = new Date(birthDate);
        let age = today.getFullYear() - birthDateObj.getFullYear();
        const m = today.getMonth() - birthDateObj.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDateObj.getDate())) {
          age--;
        }
        formData.append("age", String(age));
      }

      const response = await ApplicantService.updateApplicant(
        applicant.applicant_id,
        formData
      );

      if (response.status === 200) {
        // --- START: Consistency with EditUserFormModal for local state update ---
        const updatedApplicantData = response.data.applicant;
        // Corrected: Use updatedApplicantData.attached_file
        setExistingAttachedFileUrl(updatedApplicantData.attached_file || null);
        setNewAttachedFile(null); // Clear new file selection
        setRemoveExistingFile(false); // Reset remove flag
        setFirstName(updatedApplicantData.first_name);
        setMiddleName(updatedApplicantData.middle_name ?? "");
        setLastName(updatedApplicantData.last_name);
        setSuffixName(updatedApplicantData.suffix_name ?? "");
        setGenderId(String(updatedApplicantData.gender_id));
        setBirthDate(updatedApplicantData.birth_date);
        setContactNumber(updatedApplicantData.contact_number);
        setGmail(updatedApplicantData.gmail);
        setHouseId(
          updatedApplicantData.house?.house_id
            ? String(updatedApplicantData.house.house_id)
            : ""
        ); // Convert to string
        setStreetId(
          updatedApplicantData.street?.street_id
            ? String(updatedApplicantData.street.street_id)
            : ""
        ); // Convert to string
        setBarangayId(
          updatedApplicantData.barangay?.barangay_id
            ? String(updatedApplicantData.barangay.barangay_id)
            : ""
        ); // Convert to string
        setCityId(
          updatedApplicantData.city?.city_id
            ? String(updatedApplicantData.city.city_id)
            : ""
        ); // Convert to string
        setCrisisId(String(updatedApplicantData.crisis_id));
        setIncidentDate(updatedApplicantData.incident_date);
        setSituationId(String(updatedApplicantData.situation_id));
        setErrors({});
        // --- END: Consistency with EditUserFormModal for local state update ---

        onApplicantUpdated(response.data.message);
        refreshKey(); // Trigger refresh of applicant list
        onClose(); // Close the modal
      } else {
        setSubmissionMessage("An unexpected error occurred during update.");
      }
    } catch (error: any) {
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors);
        setSubmissionMessage("Please correct the highlighted errors.");
      } else {
        setSubmissionMessage("A network error occurred. Please try again.");
        console.error("Update error:", error);
      }
    } finally {
      setLoadingUpdate(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} showCloseButton>
      <form onSubmit={handleUpdateApplicant} className="p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-4">
          ✏️ Edit Applicant Information
        </h1>
        {submissionMessage && (
          <div
            className={`p-4 rounded-lg text-white font-medium mb-4 ${
              submissionMessage.includes("successfully")
                ? "bg-green-500"
                : "bg-red-500"
            }`}
          >
            {submissionMessage}
          </div>
        )}
        {/* Section: Personal Details */}
        <div className="border border-gray-200 rounded-lg p-6 bg-gray-50 shadow-sm transition-all duration-300 hover:shadow-md mb-8">
          <h2 className="text-2xl font-bold text-blue-800 mb-6 border-b pb-3 border-blue-100">
            👤 Personal Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FloatingLabelInput
              label="Last Name"
              type="text"
              name="last_name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              errors={errors.last_name}
            />
            <FloatingLabelInput
              label="First Name"
              type="text"
              name="first_name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              errors={errors.first_name}
            />
            <FloatingLabelInput
              label="Middle Name"
              type="text"
              name="middle_name"
              value={middleName}
              onChange={(e) => setMiddleName(e.target.value)}
              errors={errors.middle_name}
            />
            <FloatingLabelInput
              label="Suffix Name"
              type="text"
              name="suffix_name"
              value={suffixName}
              onChange={(e) => setSuffixName(e.target.value)}
              errors={errors.suffix_name}
            />
            <FloatingLabelInput
              label="Date of Birth"
              type="date"
              name="birth_date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              required
              errors={errors.birth_date}
            />
            <FloatingLabelSelect
              label="Gender"
              name="gender_id"
              value={genderId}
              onChange={(e) => setGenderId(e.target.value)}
              required
              errors={errors.gender}
            >
              {loadingGenders ? (
                <option value="">Loading Genders...</option>
              ) : (
                <>
                  <option value="">Select Gender</option>
                  {genders.map((genderOpt) => (
                    <option
                      key={genderOpt.gender_id}
                      value={genderOpt.gender_id}
                    >
                      {genderOpt.gender}
                    </option>
                  ))}
                </>
              )}
            </FloatingLabelSelect>
          </div>
        </div>
        {/* Section: Contact Information */}
        <div className="border border-gray-200 rounded-lg p-6 bg-gray-50 shadow-sm transition-all duration-300 hover:shadow-md mb-8">
          <h2 className="text-2xl font-bold text-blue-800 mb-6 border-b pb-3 border-blue-100">
            📞 Contact Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FloatingLabelInput
              label="Contact Number"
              type="tel"
              name="contact_number"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              required
              errors={errors.contact_number}
            />
            <FloatingLabelInput
              label="Gmail"
              type="email"
              name="gmail"
              value={gmail}
              onChange={(e) => setGmail(e.target.value)}
              required
              errors={errors.gmail}
            />
            <FloatingLabelSelect
              label="House"
              name="house_id"
              value={houseId}
              onChange={(e) => setHouseId(e.target.value)}
              required
              errors={errors.house}
            >
              {loadingHouses ? (
                <option value="">Loading Houses...</option>
              ) : (
                <>
                  <option value="">Select House</option>
                  {houses.map((houseOpt) => (
                    <option key={houseOpt.house_id} value={houseOpt.house_id}>
                      {houseOpt.house}
                    </option>
                  ))}
                </>
              )}
            </FloatingLabelSelect>
            <FloatingLabelSelect
              label="Street"
              name="street_id"
              value={streetId}
              onChange={(e) => setStreetId(e.target.value)}
              required
              errors={errors.street}
            >
              {loadingStreets ? (
                <option value="">Loading Streets...</option>
              ) : (
                <>
                  <option value="">Select Street</option>
                  {streets.map((streetOpt) => (
                    <option
                      key={streetOpt.street_id}
                      value={streetOpt.street_id}
                    >
                      {streetOpt.street}
                    </option>
                  ))}
                </>
              )}
            </FloatingLabelSelect>
            <FloatingLabelSelect
              label="Barangay"
              name="barangay_id"
              value={barangayId}
              onChange={(e) => setBarangayId(e.target.value)}
              required
              errors={errors.barangay}
            >
              {loadingBarangays ? (
                <option value="">Loading Barangays...</option>
              ) : (
                <>
                  <option value="">Select Barangay</option>
                  {barangays.map((barangayOpt) => (
                    <option
                      key={barangayOpt.barangay_id}
                      value={barangayOpt.barangay_id}
                    >
                      {barangayOpt.barangay}
                    </option>
                  ))}
                </>
              )}
            </FloatingLabelSelect>
            <FloatingLabelSelect
              label="City"
              name="city_id"
              value={cityId}
              onChange={(e) => setCityId(e.target.value)}
              required
              errors={errors.city}
            >
              {loadingCities ? (
                <option value="">Loading Cities...</option>
              ) : (
                <>
                  <option value="">Select City</option>
                  {cities.map((cityOpt) => (
                    <option key={cityOpt.city_id} value={cityOpt.city_id}>
                      {cityOpt.city}
                    </option>
                  ))}
                </>
              )}
            </FloatingLabelSelect>
          </div>
        </div>
        {/* Section: Crisis Information */}
        <div className="border border-gray-200 rounded-lg p-6 bg-gray-50 shadow-sm transition-all duration-300 hover:shadow-md mb-8">
          <h2 className="text-2xl font-bold text-blue-800 mb-6 border-b pb-3 border-blue-100">
            🚨 Crisis Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <FloatingLabelSelect
              label="Type of Crisis"
              name="crisis_id"
              value={crisisId}
              onChange={(e) => setCrisisId(e.target.value)}
              required
              errors={errors.crisis}
            >
              {loadingCrisiss ? (
                <option value="">Loading Crisis Types...</option>
              ) : (
                <>
                  <option value="">Select Crisis Type</option>
                  {crisiss.map((crisisOpt) => (
                    <option
                      key={crisisOpt.crisis_id}
                      value={crisisOpt.crisis_id}
                    >
                      {crisisOpt.crisis}
                    </option>
                  ))}
                </>
              )}
            </FloatingLabelSelect>
            <FloatingLabelInput
              label="Date of Incident"
              type="date"
              name="incident_date"
              value={incidentDate}
              onChange={(e) => setIncidentDate(e.target.value)}
              required
              errors={errors.incident_date}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium text-sm mb-3">
              Your Current Situation: <span className="text-red-500">*</span>
            </label>
            {loadingSituations ? (
              <p className="text-gray-500">Loading situations...</p>
            ) : situations.length === 0 ? (
              <p className="text-gray-500">No situations available.</p>
            ) : (
              <div className="flex flex-wrap gap-4">
                {situations.map((situationOpt) => (
                  <label
                    key={situationOpt.situation_id}
                    className="inline-flex items-center text-gray-800 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="situation_id"
                      value={String(situationOpt.situation_id)}
                      checked={
                        situationId === String(situationOpt.situation_id)
                      }
                      onChange={(e) => setSituationId(e.target.value)}
                      className="form-radio h-5 w-5 text-blue-600 border-gray-300 rounded-full focus:ring-blue-500 shadow-sm"
                      required={true}
                    />
                    <span className="ml-2">{situationOpt.situation}</span>
                  </label>
                ))}
              </div>
            )}
            {errors.situation && (
              <p className="mt-2 text-sm text-red-600">{errors.situation[0]}</p>
            )}
          </div>
        </div>
        {/* Section: Attached File */}
        <div className="border border-gray-200 rounded-lg p-6 bg-gray-50 shadow-sm transition-all duration-300 hover:shadow-md mb-8">
          <h2 className="text-2xl font-bold text-blue-800 mb-6 border-b pb-3 border-blue-100">
            📎 Attached File
          </h2>
          {/* Corrected: Reverted to using the UploadInput component */}
          <UploadFileInput
            label="Upload New File (Optional)"
            name="edit_applicant_file" // Name for the file in update request
            value={newAttachedFile}
            onChange={(file) => {
              setNewAttachedFile(file);
              if (file) {
                setRemoveExistingFile(false); // If new file selected, don't remove existing
              }
            }}
            onRemoveExistingImageUrl={() => setRemoveExistingFile(true)} // Handle remove via checkbox
            existingImageUrl={existingAttachedFileUrl}
            errors={errors.attached_file}
          />
          {existingAttachedFileUrl &&
            !removeExistingFile &&
            !newAttachedFile && (
              <div className="mb-4 p-3 bg-blue-50 rounded-lg flex items-center justify-between shadow-inner text-blue-800">
                <span>
                  Current File:{" "}
                  <a
                    href={existingAttachedFileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline font-semibold"
                  >
                    {existingAttachedFileUrl.split("/").pop()}
                  </a>
                </span>
                <label className="flex items-center text-red-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={removeExistingFile}
                    onChange={(e) => setRemoveExistingFile(e.target.checked)}
                    className="form-checkbox h-4 w-4 text-red-600 rounded mr-2"
                  />
                  Remove
                </label>
              </div>
            )}
          <p className="text-sm text-gray-600">
            NOTE: Please upload files in JPEG or PDF format only. Uploading a
            new file will replace the existing one.
          </p>
        </div>
        {/* Submit Button */}
        <div className="flex justify-center mt-8 gap-4">
          <CloseButton label="Cancel" onClose={onClose} />
          <SubmitButton
            label="Update Applicant"
            loading={loadingUpdate}
            loadingLabel="Updating..."
          />
        </div>
      </form>
    </Modal>
  );
};

export default EditApplicantFormModal;
