import { useEffect } from "react";
import EditBarangayForm from "./components/EditBarangayForm";
import ToastMessage from "../../components/ToastMessage/ToastMessage";
import { useToastMessage } from "../../hooks/useToastMessage";

const EditBarangayPage = () => {
  useEffect(() => {
    document.title = "Barangay Edit Page";
  }, []);

  const {
    message: toastMessage,
    isVisible: toastMessageIsVisible,
    showToastMessage,
    closeToastMessage,
  } = useToastMessage("", false);

  return (
    <>
      <ToastMessage
        message={toastMessage}
        isVisible={toastMessageIsVisible}
        onClose={closeToastMessage}
      />
      <EditBarangayForm onBarangayUpdated={showToastMessage} />
    </>
  );
};

export default EditBarangayPage;
