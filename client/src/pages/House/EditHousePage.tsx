import { useEffect } from "react";
import EditHouseForm from "./components/EditHouseForm";
import ToastMessage from "../../components/ToastMessage/ToastMessage";
import { useToastMessage } from "../../hooks/useToastMessage";

const EditHousePage = () => {
  useEffect(() => {
    document.title = "House Edit Page";
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
      <EditHouseForm onHouseUpdated={showToastMessage} />
    </>
  );
};

export default EditHousePage;
