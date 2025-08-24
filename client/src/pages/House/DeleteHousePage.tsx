import { useEffect } from "react";
import DeleteHouseForm from "./components/DeleteHouseForm";

const DeleteHousePage = () => {
  useEffect(() => {
    document.title = "House Delete Page";
  }, []);
  return (
    <>
      <DeleteHouseForm />
    </>
  );
};

export default DeleteHousePage;
