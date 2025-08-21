import ToastMessage from "../../components/ToastMessage/ToastMessage";
import { useModal } from "../../hooks/useModal";
import AddUserFormModal from "./components/AddUserFormModal";
import EditUserFormModal from "./components/EditUserFormModal";
import UserList from "./components/UserList";
import { useToastMessage } from "../../hooks/useToastMessage";
import { useRefresh } from "../../hooks/useRefresf";
import DeleteUserFormModal from "./components/DeleteUserFormModal";
import { useEffect } from "react";
import type { UserColumns } from "../../interfaces/UserInterface";

const UserMainPage = () => {
  useEffect(() => {
    document.title = "User Main Page";
  }, []);

  const {
    isOpen: isAddUserFormModalOpen,
    openModal: openAddUserFormModal,
    closeModal: closeAddUserFormModal,
  } = useModal<UserColumns>(false);

  const {
    isOpen: isEditUserFormModalOpen,
    selectedItem: selectedUserForEdit,
    openModal: openEditUserFormModal,
    closeModal: closeEditUserFormModal,
  } = useModal<UserColumns>(false);

  const {
    isOpen: isDeleteUserFormModalOpen,
    selectedItem: selectedUserForDelete,
    openModal: openDeleteUserFormModal,
    closeModal: closeDeleteUserFormModal,
  } = useModal<UserColumns>(false);

  const {
    message: toastMessage,
    isVisible: toastMessageIsVisible,
    showToastMessage,
    closeToastMessage,
  } = useToastMessage("", false, false);

  const { refresh, handleRefresh } = useRefresh(false);

  return (
    <>
      <ToastMessage
        message={toastMessage}
        isVisible={toastMessageIsVisible}
        onClose={closeToastMessage}
      />
      <AddUserFormModal
        isOpen={isAddUserFormModalOpen}
        onClose={closeAddUserFormModal}
        onUserAdded={showToastMessage}
        refreshKey={handleRefresh}
      />
      <EditUserFormModal
        user={selectedUserForEdit}
        onClose={closeEditUserFormModal}
        isOpen={isEditUserFormModalOpen}
        onUserUpdated={showToastMessage}
        refreshKey={handleRefresh}
      />
      <DeleteUserFormModal
        user={selectedUserForDelete}
        onClose={closeDeleteUserFormModal}
        isOpen={isDeleteUserFormModalOpen}
        onUserDeleted={showToastMessage}
        refreshKey={handleRefresh}
      />
      <UserList
        onAddUser={openAddUserFormModal}
        onEditUser={(user) => openEditUserFormModal(user)}
        onDeleteUser={(user) => openDeleteUserFormModal(user)}
        refreshKey={refresh}
      />
    </>
  );
};

export default UserMainPage;
