import { useEffect } from "react";
import DeleteStreetForm from "./components/DeleteStreetForm";

const DeleteStreetPage = () => {
  useEffect(() => {
    document.title = "Street Delete Page";
  }, []);
  return (
    <>
      <DeleteStreetForm />
    </>
  );
};

export default DeleteStreetPage;
