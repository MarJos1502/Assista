import { useEffect, useState, type FC } from "react";
import Modal from "../../components/Modal";
import { useAuth } from "../../contexts/AuthContext";
import CloseButton from "../../components/Button/CloseButton";
import SubmitButton from "../../components/Button/SubmitButton";
import FloatingLabelInput from "../../components/Input/FloatingLabelInput";
import FloatingLabelSelect from "../../components/Select/FloatingLabelSelect";
import UploadInput from "../../components/Input/UploadInput";
import GenderService from "../../services/GenderService";
import UserService from "../../services/UserService";
import type { GenderColumns } from "../../interfaces/GenderInterface";
import type { UserFieldErrors } from "../../interfaces/UserInterface";

interface HorizontalUserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HorizontalUserProfileModal: FC<HorizontalUserProfileModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { user, updateUser } = useAuth();
  const [loadingGenders, setLoadingGenders] = useState(false);
  const [genders, setGenders] = useState<GenderColumns[]>([]);

  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [existingProfilePicture, setExistingProfilePicture] = useState<
    string | null
  >(null);
  const [editUserProfilePicture, setEditUserProfilePicture] =
    useState<File | null>(null);
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [suffixName, setSuffixName] = useState("");
  const [gender, setGender] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gmail, setGmail] = useState("");
  const [errors, setErrors] = useState<UserFieldErrors>({});

  const handleUpdateUser = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      setLoadingUpdate(true);

      const formData = new FormData();
      formData.append("_method", "PUT");

      if (editUserProfilePicture) {
        formData.append("edit_user_profile_picture", editUserProfilePicture);
      } else if (!existingProfilePicture) {
        formData.append("remove_profile_picture", "1");
      }

      formData.append("first_name", firstName);
      formData.append("middle_name", middleName || "");
      formData.append("last_name", lastName);
      formData.append("suffix_name", suffixName || "");
      formData.append("gender", gender);
      formData.append("birth_date", birthDate);
      formData.append("gmail", gmail);

      if (!user || !user.user) {
        throw new Error("User data is not available");
      }
      const res = await UserService.updateUser(user.user.user_id, formData);

      if (res.status === 200) {
        setExistingProfilePicture(
          res.data.user.profile_picture ? res.data.user.profile_picture : null
        );
        setEditUserProfilePicture(null);
        setErrors({});

        updateUser({
          user: res.data.user,
          token: localStorage.getItem("token") || "",
        });

        onClose();
      }
    } catch (error: any) {
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors);
      }
    } finally {
      setLoadingUpdate(false);
    }
  };

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

  useEffect(() => {
    if (isOpen) {
      handleLoadGenders();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && user) {
      setEditUserProfilePicture(null);
      setExistingProfilePicture(
        user.user.profile_picture ? user.user.profile_picture : null
      );
      setFirstName(user.user.first_name);
      setMiddleName(user.user.middle_name ?? "");
      setLastName(user.user.last_name);
      setSuffixName(user.user.suffix_name ?? "");
      setGender(user.user.gender?.gender?.toString() || "");
      setBirthDate(user.user.birth_date);
      setGmail(user.user.gmail);
    }
  }, [isOpen, user]);

  if (!user) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      showCloseButton
      className="max-w-4xl"
    >
      <form onSubmit={handleUpdateUser}>
        <h1 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4 text-center">
          👤 User Profile
        </h1>

        {/* Horizontal Layout Container - Centered */}
        <div className="flex flex-col lg:flex-row gap-8 items-center justify-center">
          {/* Left Side - Profile Picture */}
          <div className="lg:w-2/5 flex justify-center">
            <div className="mb-6 w-full max-w-xs">
              <UploadInput
                label="Profile Picture"
                name="edit_user_profile_picture"
                value={editUserProfilePicture}
                onChange={setEditUserProfilePicture}
                onRemoveExistingImageUrl={() => setExistingProfilePicture(null)}
                existingImageUrl={existingProfilePicture}
                errors={errors.edit_user_profile_picture}
              />
            </div>
          </div>

          {/* Right Side - Personal Information */}
          <div className="lg:w-3/5">
            <div className="mb-6">
              <h3 className="text-lg text-center font-semibold text-gray-800 mb-6">
                📋 Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  label="Last Name"
                  type="text"
                  name="last_name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  errors={errors.last_name}
                />
                <FloatingLabelInput
                  label="Suffix Name"
                  type="text"
                  name="suffix_name"
                  value={suffixName}
                  onChange={(e) => setSuffixName(e.target.value)}
                  errors={errors.suffix_name}
                />
                <FloatingLabelSelect
                  label="Gender"
                  name="gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  required
                  errors={errors.gender}
                >
                  {loadingGenders ? (
                    <option value="">Loading...</option>
                  ) : (
                    <>
                      <option value="">Select Gender</option>
                      {genders.map((genderOpt) => (
                        <option key={genderOpt.gender_id} value={genderOpt.gender_id}>
                          {genderOpt.gender}
                        </option>
                      ))}
                    </>
                  )}
                </FloatingLabelSelect>
                <FloatingLabelInput
                  label="Date of Birth"
                  type="date"
                  name="birth_date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  required
                  errors={errors.birth_date}
                />
                <FloatingLabelInput
                  label="Email Address"
                  type="email"
                  name="gmail"
                  value={gmail}
                  onChange={(e) => setGmail(e.target.value)}
                  required
                  errors={errors.gmail}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center mt-6 gap-4 border-t pt-6">
          {!loadingUpdate && <CloseButton label="Close" onClose={onClose} />}
          <SubmitButton
            label="Save Profile"
            loading={loadingUpdate}
            loadingLabel="Updating..."
          />
        </div>
      </form>
    </Modal>
  );
};

export default HorizontalUserProfileModal;
