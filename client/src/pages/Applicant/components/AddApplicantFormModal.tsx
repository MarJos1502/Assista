import { useState, useEffect, type FC, type FormEvent } from "react";
import Modal from "../../../components/Modal";
import type { GenderColumns } from "../../../interfaces/GenderInterface";
import type { CrisisColumns } from "../../../interfaces/CrisisInterface";
import type { SituationColumns } from "../../../interfaces/SituationInterface";
import GenderService from "../../../services/GenderService";
import crisisService from "../../../services/CrisisService";
import SituationService from "../../../services/SituationService";
import ApplicantService from "../../../services/ApplicantService";
import CloseButton from "../../../components/Button/CloseButton";
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
  const [birthDate, setBirthDate] = useState("");

  // State for Contact Information
  const [contactNumber, setContactNumber] = useState("");
  const [gmail, setGmail] = useState("");
  const [houseNo, setHouseNo] = useState("");
  const [street, setStreet] = useState("");
  const [subdivision, setSubdivision] = useState("");
  const [barangay, setBarangay] = useState("");
  const [city, setCity] = useState("");

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
        // Handle error without console.error
      }
    } catch (error) {
      // Handle error without console.error
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
      } else {
        // Handle error without console.error
      }
    } catch (error) {
      // Handle error without console.error
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
        // Handle error without console.error
      }
    } catch (error) {
      // Handle error without console.error
    } finally {
      setLoadingSituations(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      handleLoadGenders();
      handleLoadCrisiss();
      handleLoadSituations();
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
      formData.append("house_no", houseNo);
      formData.append("street", street);
      formData.append("subdivision", subdivision || "");
      formData.append("barangay", barangay);
      formData.append("city", city);

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
        setHouseNo("");
        setStreet("");
        setSubdivision("");
        setBarangay("");
        setCity("");
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
            <FloatingLabelInput
              label="House No. / Lot / Block"
              type="text"
              name="house_no"
              value={houseNo}
              onChange={(e) => setHouseNo(e.target.value)}
              required
              errors={errors.house_no}
            />
            <FloatingLabelInput
              label="Street"
              type="text"
              name="street"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              required
              errors={errors.street}
            />
            <FloatingLabelInput
              label="Subdivision"
              type="text"
              name="subdivision"
              value={subdivision}
              onChange={(e) => setSubdivision(e.target.value)}
              errors={errors.subdivision}
            />
            <FloatingLabelInput
              label="Barangay"
              type="text"
              name="barangay"
              value={barangay}
              onChange={(e) => setBarangay(e.target.value)}
              required
              errors={errors.barangay}
            />
            <FloatingLabelInput
              label="City / Municipality"
              type="text"
              name="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
              errors={errors.city}
            />
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
          <div className="flex items-center space-x-4 mb-4">
            <input
              type="file"
              id="attachedFile"
              name="add_applicant_file"
              onChange={(e) =>
                setAttachedFile(e.target.files ? e.target.files[0] : null)
              }
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600 shadow-sm"
            />
            {attachedFile && (
              <span className="text-gray-700">{attachedFile.name}</span>
            )}
          </div>
          {errors.attached_file && (
            <p className="mt-2 text-sm text-red-600">
              {errors.attached_file[0]}
            </p>
          )}
          <p className="text-sm text-gray-600">
            NOTE: Please upload files in JPEG or PDF format only
          </p>
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
