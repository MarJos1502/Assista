import { useState, useEffect, type FC, type FormEvent } from "react";
import Modal from "../../../components/Modal";
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
import ApplicantService from "../../../services/ApplicantService";
import HouseService from "../../../services/HouseService";
import StreetService from "../../../services/StreetService";
import BarangayService from "../../../services/BarangayService";
import CityService from "../../../services/CityService";
import CloseButton from "../../../components/Button/CloseButton";
import UploadFileInput from "../../../components/Input/UploadFileInput";
import SubmitButton from "../../../components/Button/SubmitButton";
import type { ApplicantFieldErrors } from "../../../interfaces/ApplicantInterface";
import FloatingLabelInput from "../../../components/Input/FloatingLabelInput";
import FloatingLabelSelect from "../../../components/Select/FloatingLabelSelect";

interface AddApplicantFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplicantAdded: (message: string) => void;
  refreshKey: () => void;
}

const AddApplicantFormModal: FC<AddApplicantFormModalProps> = ({
  isOpen,
  onClose,
  onApplicantAdded,
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
  const [loadingHouses, setLoadingHouses] = useState(false);
  const [loadingStreets, setLoadingStreets] = useState(false);
  const [loadingBarangays, setLoadingBarangays] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [birthDate, setBirthDate] = useState("");

  // State for Contact Information
  const [contactNumber, setContactNumber] = useState("");
  const [gmail, setGmail] = useState("");
  const [houseId, setHouseId] = useState("");
  const [houses, setHouses] = useState<HouseColumns[]>([]);
  const [streetId, setStreetId] = useState("");
  const [streets, setStreets] = useState<StreetColumns[]>([]);
  const [barangayId, setBarangayId] = useState("");
  const [barangays, setBarangays] = useState<BarangayColumns[]>([]);
  const [cityId, setCityId] = useState("");
  const [cities, setCities] = useState<CityColumns[]>([]);

  // State for Crisis Information
  const [crisisId, setCrisisId] = useState("");
  const [crisiss, setCrisiss] = useState<CrisisColumns[]>([]);
  const [loadingCrisiss, setLoadingCrisiss] = useState(false);
  const [incidentDate, setIncidentDate] = useState("");
  const [situationId, setSituationId] = useState("");
  const [situations, setSituations] = useState<SituationColumns[]>([]);
  const [loadingSituations, setLoadingSituations] = useState(false);

  // State for Attached File
  const [attachedFile, setAttachedFile] = useState<File | null>(null);

  // State for Declaration
  const [consentGiven, setConsentGiven] = useState(false);

  // General form submission loading and errors
  const [loadingStore, setLoadingStore] = useState(false);
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
      } else {
        console.error(
          "Unexpected error occurred during loading genders: ",
          res.status
        );
      }
    } catch (error) {
      console.error(
        "Unexpected server error occurred during loading genders: ",
        error
      );
    } finally {
      setLoadingGenders(false);
    }
  };

  const handleLoadHouses = async () => {
    try {
      setLoadingHouses(true);
      const res = await HouseService.loadHouses();
      if (res.status === 200) {
        setHouses(res.data.houses);
      } else {
        console.error(
          "Unexpected error occurred during loading houses: ",
          res.status
        );
      }
    } catch (error) {
      console.error(
        "Unexpected server error occurred during loading houses: ",
        error
      );
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
      } else {
        console.error(
          "Unexpected error occurred during loading streets: ",
          res.status
        );
      }
    } catch (error) {
      console.error(
        "Unexpected server error occurred during loading streets: ",
        error
      );
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
      } else {
        console.error(
          "Unexpected error occurred during loading barangays: ",
          res.status
        );
      }
    } catch (error) {
      console.error(
        "Unexpected server error occurred during loading barangays: ",
        error
      );
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
      } else {
        console.error(
          "Unexpected error occurred during loading cities: ",
          res.status
        );
      }
    } catch (error) {
      console.error(
        "Unexpected server error occurred during loading cities: ",
        error
      );
    } finally {
      setLoadingCities(false);
    }
  };

  const handleLoadCrisiss = async () => {
    try {
      setLoadingCrisiss(true);
      const res = await crisisService.loadCrisiss();
      if (res.status === 200) {
        setCrisiss(res.data.crisiss);
      } else {
        console.error(
          "Unexpected error occurred during loading crisis types: ",
          res.status
        );
      }
    } catch (error) {
      console.error(
        "Unexpected server error occurred during loading crisis types: ",
        error
      );
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
      } else {
        console.error(
          "Unexpected error occurred during loading situations: ",
          res.status
        );
      }
    } catch (error) {
      console.error(
        "Unexpected server error occurred during loading situations: ",
        error
      );
    } finally {
      setLoadingSituations(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      handleLoadGenders();
      handleLoadCrisiss();
      handleLoadSituations();
      handleLoadHouses();
      handleLoadStreets();
      handleLoadBarangays();
      handleLoadCities();
    }
  }, [isOpen]);

  // --- Form Submission Handler ---
  const handleStoreApplicant = async (e: FormEvent) => {
    e.preventDefault();

    setLoadingStore(true);
    setErrors({});
    setSubmissionMessage(null);

    if (!consentGiven) {
      setSubmissionMessage(
        "Please agree to the privacy consent before submitting."
      );
      setLoadingStore(false);
      return;
    }

    try {
      const formData = new FormData();

      if (attachedFile) {
        formData.append("add_applicant_file", attachedFile);
      }

      // Personal Details
      formData.append("first_name", firstName);
      formData.append("middle_name", middleName || "");
      formData.append("last_name", lastName);
      formData.append("suffix_name", suffixName || "");
      formData.append("birth_date", birthDate);
      formData.append("gender", genderId);

      // Contact Information
      formData.append("contact_number", contactNumber);
      formData.append("gmail", gmail);
      formData.append("house", houseId);
      formData.append("street", streetId);
      formData.append("barangay", barangayId);
      formData.append("city", cityId);

      // Crisis Details
      formData.append("crisis", crisisId);
      formData.append("incident_date", incidentDate);
      formData.append("situation", situationId);

      const response = await ApplicantService.storeApplicant(formData);

      if (response.status === 200 || response.status === 201) {
        setLastName("");
        setFirstName("");
        setMiddleName("");
        setSuffixName("");
        setGenderId("");
        setBirthDate("");
        setContactNumber("");
        setGmail("");
        setHouseId("");
        setStreetId("");
        setBarangayId("");
        setCityId("");
        setCrisisId("");
        setIncidentDate("");
        setSituationId("");
        setAttachedFile(null);
        setConsentGiven(false);
        setErrors({});

        onApplicantAdded(response.data.message);
        refreshKey();
        onClose();
      } else {
        setSubmissionMessage(
          "An unexpected error occurred during registration."
        );
      }
    } catch (error: any) {
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors);
        setSubmissionMessage("Please correct the highlighted errors.");
      } else {
        setSubmissionMessage("A network error occurred. Please try again.");
      }
    } finally {
      setLoadingStore(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} showCloseButton>
      <form onSubmit={handleStoreApplicant} className="p-6">
        {" "}
        {/* Updated onSubmit */}
        <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-4">
          Crisis Situation Online Registration
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
          <UploadFileInput
            label="Upload File"
            name="add_applicant_file"
            value={attachedFile}
            onChange={(file) => setAttachedFile(file)}
            errors={errors.attached_file}
          />
        </div>
        {/* Section: Declaration and Consent */}
        <div className="border border-gray-200 rounded-lg p-6 bg-gray-50 shadow-sm transition-all duration-300 hover:shadow-md mb-8">
          <h2 className="text-2xl font-bold text-blue-800 mb-6 border-b pb-3 border-blue-100">
            ✅ Declaration & Consent
          </h2>
          <div className="flex items-start mb-6">
            <input
              type="checkbox"
              id="consentGiven"
              name="consentGiven"
              checked={consentGiven}
              onChange={(e) => setConsentGiven(e.target.checked)}
              required
              className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500 mr-2 mt-1 shadow-sm"
            />
            <label
              htmlFor="consentGiven"
              className="text-gray-700 text-sm leading-relaxed"
            >
              I hereby declare that the information provided is true and correct
              to the best of my knowledge and belief. I understand that this
              information will be used to assess my needs for crisis relief and
              may be shared with relevant government agencies and humanitarian
              organizations for the purpose of providing assistance.
            </label>
          </div>
        </div>
        {/* Submit Button */}
        <div className="flex justify-center mt-8 gap-4">
          {" "}
          {/* Added gap for spacing between buttons */}
          {!loadingStore && <CloseButton label="Close" onClose={onClose} />}
          <SubmitButton
            label="Submit Registration"
            loading={loadingStore}
            loadingLabel="Submitting..."
          />
        </div>
      </form>
    </Modal>
  );
};

export default AddApplicantFormModal;
