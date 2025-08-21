import ToastMessage from "../../components/ToastMessage/ToastMessage";
import { useModal } from "../../hooks/useModal";
import AddApplicantFormModal from "./components/AddApplicantFormModal";
import ApplicantList from "./components/ApplicantList";
import { useToastMessage } from "../../hooks/useToastMessage";
import { useRefresh } from "../../hooks/useRefresf";
import { useEffect } from "react";
import EditApplicantFormModal from "./components/EditApplicantFormModal";
import DeleteApplicantFormModal from "./components/DeleteApplicantFormModal";
import type { ApplicantColumns } from "../../interfaces/ApplicantInterface";

const ApplicantMainPage = () => {
  useEffect(() => {
    document.title = "Applicant Main Page";
  }, []);

  // State and handlers for the Add Applicant modal
  const {
    isOpen: isAddApplicantFormModalOpen,
    openModal: openAddApplicantFormModal,
    closeModal: closeAddApplicantFormModal,
  } = useModal<ApplicantColumns>(false);

  // State and handlers for the Edit Applicant modal
  const {
    isOpen: isEditApplicantFormModalOpen,
    selectedItem: selectedApplicantForEdit,
    openModal: openEditApplicantFormModal,
    closeModal: closeEditApplicantFormModal,
  } = useModal<ApplicantColumns>(false);

  // State and handlers for the Delete Applicant modal
  const {
    isOpen: isDeleteApplicantFormModalOpen,
    selectedItem: selectedApplicantForDelete,
    openModal: openDeleteApplicantFormModal,
    closeModal: closeDeleteApplicantFormModal,
  } = useModal<ApplicantColumns>(false);

  // State and handlers for toast messages (notifications)
  const {
    message: toastMessage,
    isVisible: toastMessageIsVisible,
    showToastMessage,
    closeToastMessage,
  } = useToastMessage("", false);

  // State and handler for refreshing data in ApplicantList
  const { refresh, handleRefresh } = useRefresh(false);

  return (
    <>
      {/* Toast message component for displaying notifications */}
      <ToastMessage
        message={toastMessage}
        isVisible={toastMessageIsVisible}
        onClose={closeToastMessage}
      />

      {/* Modal for adding a new applicant */}
      <AddApplicantFormModal
        isOpen={isAddApplicantFormModalOpen}
        onClose={closeAddApplicantFormModal}
        onApplicantAdded={showToastMessage}
        refreshKey={handleRefresh}
      />

      {/* Modal for editing an existing applicant */}
      <EditApplicantFormModal
        applicant={selectedApplicantForEdit}
        onClose={closeEditApplicantFormModal}
        isOpen={isEditApplicantFormModalOpen}
        onApplicantUpdated={showToastMessage}
        refreshKey={handleRefresh}
      />

      {/* Modal for confirming deletion of an applicant */}
      <DeleteApplicantFormModal
        applicant={selectedApplicantForDelete}
        onClose={closeDeleteApplicantFormModal}
        isOpen={isDeleteApplicantFormModalOpen}
        onApplicantDeleted={showToastMessage}
        refreshKey={handleRefresh}
      />

      {/* Component to display the list of applicants */}
      <ApplicantList
        onAddApplicant={openAddApplicantFormModal}
        onEditApplicant={(applicant) => openEditApplicantFormModal(applicant)}
        onDeleteApplicant={(applicant) =>
          openDeleteApplicantFormModal(applicant)
        }
        refreshKey={refresh}
      />
    </>
  );
};

export default ApplicantMainPage;
