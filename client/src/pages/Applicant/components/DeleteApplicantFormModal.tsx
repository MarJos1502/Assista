import { useState, type FC } from "react";
import CloseButton from "../../../components/Button/CloseButton";
import Modal from "../../../components/Modal";
import ApplicantService from "../../../services/ApplicantService";
import type { ApplicantColumns } from "../../../interfaces/ApplicantInterface";

interface DeleteApplicantFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicant: ApplicantColumns | null;
  onApplicantDeleted: (message: string) => void;
  refreshKey: () => void;
}

const DeleteApplicantFormModal: FC<DeleteApplicantFormModalProps> = ({
  isOpen,
  onClose,
  applicant,
  onApplicantDeleted,
  refreshKey,
}) => {
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState<string | null>(
    null
  );

  const handleDelete = async () => {
    if (!applicant) {
      setSubmissionMessage("Error: No applicant data provided for deletion.");
      return;
    }

    setLoadingDelete(true);
    setSubmissionMessage(null);

    try {
      const response = await ApplicantService.destroyApplicant(
        applicant.applicant_id
      );

      if (response.status === 200) {
        onApplicantDeleted(response.data.message);
        refreshKey();
        onClose();
      } else {
        setSubmissionMessage(
          response.data?.message ||
            "An unexpected error occurred during deletion."
        );
      }
    } catch (error: any) {
      if (error.response?.status === 404) {
        setSubmissionMessage(
          "Applicant not found. It may have already been deleted."
        );
      } else if (error.response?.status === 403) {
        setSubmissionMessage(
          "You don't have permission to delete this applicant."
        );
      } else {
        setSubmissionMessage("A network error occurred. Please try again.");
      }
      console.error("Delete error:", error);
    } finally {
      setLoadingDelete(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} showCloseButton>
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
        {submissionMessage && (
          <div
            className={`p-4 rounded-lg text-white font-medium mb-4 bg-red-500`}
          >
            {submissionMessage}
          </div>
        )}
        <p className="mb-6">
          Are you sure you want to delete applicant:{" "}
          <span className="font-bold">
            {applicant
              ? `${applicant.first_name} ${applicant.last_name}`
              : "this applicant"}
          </span>
          ?
        </p>
        <div className="flex justify-center gap-4">
          <CloseButton label="Cancel" onClose={onClose} />
          <button
            type="button"
            onClick={handleDelete}
            disabled={loadingDelete}
            className={`bg-red-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-200 font-semibold ${
              loadingDelete ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loadingDelete ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteApplicantFormModal;
