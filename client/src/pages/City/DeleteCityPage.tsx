import { useEffect } from "react";
import DeleteCityForm from "./components/DeleteCityForm";

const DeleteCityPage = () => {
  useEffect(() => {
    document.title = "City Delete Page";
  }, []);
  return (
    <>
      <DeleteCityForm />
    </>
  );
};

export default DeleteCityPage;
