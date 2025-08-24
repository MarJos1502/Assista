import { useEffect } from "react";
import EditStreetForm from "./components/EditStreetForm";
import ToastMessage from "../../components/ToastMessage/ToastMessage";
import { useToastMessage } from "../../hooks/useToastMessage";

const EditStreetPage = () => {
  useEffect(() => {
    document.title = "Street Edit Page";
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
      <EditStreetForm onStreetUpdated={showToastMessage} />
    </>
  );
};

export default EditStreetPage;
