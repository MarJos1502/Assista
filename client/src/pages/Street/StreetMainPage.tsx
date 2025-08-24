import { useEffect } from "react";
import AddStreetForm from "./components/AddStreetForm";
import StreetList from "./components/StreetList";
import ToastMessage from "../../components/ToastMessage/ToastMessage";
import { useToastMessage } from "../../hooks/useToastMessage";
import { useRefresh } from "../../hooks/useRefresf";
import { useLocation } from "react-router-dom";

const StreetMainPage = () => {
  const location = useLocation();
  const {
    message: toastMessage,
    isVisible: toustMessageIsVisible,
    showToastMessage,
    closeToastMessage,
  } = useToastMessage("", false, false);

  const { refresh, handleRefresh } = useRefresh(false);

  useEffect(() => {
    document.title = "Street Main Page";
  }, []);

  useEffect(() => {
    if (location.state?.message) {
      showToastMessage(location.state.message);
      handleRefresh;
      window.history.replaceState({}, document.title);
    }
  }, [location.state, showToastMessage]);
  return (
    <>
      <ToastMessage
        message={toastMessage}
        isVisible={toustMessageIsVisible}
        onClose={closeToastMessage}
      />
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 md:col-span-1">
          <AddStreetForm
            onStreetAdded={showToastMessage}
            refreshKey={handleRefresh}
          />
        </div>
        <div className="col-span-2 md:col-span-1">
          <StreetList refreshKey={refresh} />
        </div>
      </div>
    </>
  );
};

export default StreetMainPage;
