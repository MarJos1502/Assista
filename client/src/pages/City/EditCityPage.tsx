import { useEffect } from "react";
import EditCityForm from "./components/EditCityForm";
import ToastMessage from "../../components/ToastMessage/ToastMessage";
import { useToastMessage } from "../../hooks/useToastMessage";

const EditCityPage = () => {
  useEffect(() => {
    document.title = "City Edit Page";
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
      <EditCityForm onCityUpdated={showToastMessage} />
    </>
  );
};

export default EditCityPage;
