import { useEffect, useState, type FormEvent } from "react";
import BackButton from "../../../components/Button/BackButton";
import SubmitButton from "../../../components/Button/SubmitButton";
import FloatingLabelInput from "../../../components/Input/FloatingLabelInput";
import { useNavigate, useParams } from "react-router-dom";
import HouseService from "../../../services/HouseService";
import Spinner from "../../../components/Spinner/Spinner";

const DeleteHouseForm = () => {
  const [loadingGet, setLoadingGet] = useState(false);
  const [loadingDestroy, setLoadingDestroy] = useState(false);
  const [house, setHouse] = useState("");

  const { house_id } = useParams();
  const navigate = useNavigate();

  const handleGetHouse = async (houseId: string | number) => {
    try {
      setLoadingGet(true);
      const res = await HouseService.getHouse(houseId);

      if (res.status === 200) {
        setHouse(res.data.house.house);
      } else {
        console.error(
          "Unexpected error occurred during getting House: ",
          res.data
        );
      }
    } catch (error) {
      console.error(
        "Unexpected server error occurred during getting House: ",
        error
      );
    } finally {
      setLoadingGet(false);
    }
  };

  const handleDestroyHouse = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setLoadingDestroy(true);

      const res = await HouseService.destroyHouse(house_id!);

      if (res.status === 200) {
        setHouse("");
        navigate("/Houses", { state: { message: res.data.message } });
      } else {
        console.error(
          "Unexpected error occurred during deleting House: ",
          res.status
        );
      }
    } catch (error) {
      console.error(
        "Unexpected server error occurred during deleting House: ",
        error
      );
    } finally {
      setLoadingDestroy(false);
    }
  };

  useEffect(() => {
    if (house_id) {
      const parseHouseId = parseInt(house_id);
      handleGetHouse(parseHouseId);
    } else {
      console.error(
        "Unexpected parameter error occurred during getting House:",
        house_id
      );
    }
  }, [house_id]);

  return (
    <>
      {loadingGet ? (
        <div className="flex justify-center items-center mt-52">
          <Spinner size="lg" />
        </div>
      ) : (
        <form onSubmit={handleDestroyHouse}>
          <div className="mb-4">
            <FloatingLabelInput
              label="House"
              type="text"
              name="House"
              value={house}
              readOnly
            />
          </div>
          <div className="flex justify-end gap-2">
            {!loadingDestroy && <BackButton label="Back" path="/Houses" />}
            <SubmitButton
              label="Delete House"
              className="bg-red-600 hover:bg-red-700"
              loading={loadingDestroy}
              loadingLabel="Deleting House..."
            />
          </div>
        </form>
      )}
    </>
  );
};

export default DeleteHouseForm;
