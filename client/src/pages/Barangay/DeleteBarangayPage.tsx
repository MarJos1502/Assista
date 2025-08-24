import { useEffect } from "react";
import DeleteBarangayForm from "./components/DeleteBarangayForm";

const DeleteBarangayPage = () => {
  useEffect(() => {
    document.title = "Barangay Delete Page";
  }, []);
  return (
    <>
      <DeleteBarangayForm />
    </>
  );
};

export default DeleteBarangayPage;
