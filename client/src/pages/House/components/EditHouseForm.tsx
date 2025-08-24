import { useEffect, useState, type FC, type FormEvent } from "react";
import BackButton from "../../../components/Button/BackButton";
import SubmitButton from "../../../components/Button/SubmitButton";
import FloatingLabelInput from "../../../components/Input/FloatingLabelInput";
import HouseService from "../../../services/HouseService";
import { useParams } from "react-router-dom";
import Spinner from "../../../components/Spinner/Spinner";
import type { HouseFieldErrors } from "../../../interfaces/HouseInterface";

interface EditHouseFormProps {
  onHouseUpdated: (message: string) => void;
}

const EditHouseForm: FC<EditHouseFormProps> = ({ onHouseUpdated }) => {
  const { house_id } = useParams();
  const [loadingGet, setLoadingGet] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [house, setHouse] = useState("");
  const [errors, setErrors] = useState<HouseFieldErrors>({});

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

  const handleUpdateHouse = async (e: FormEvent) => {
    try {
      e.preventDefault();

      setLoadingUpdate(true);

      const res = await HouseService.updateHouse(house_id!, { house });

      if (res.status === 200) {
        setErrors({});
        setHouse(res.data.house.house);
        onHouseUpdated(res.data.message);
      } else {
        console.error(
          "Unexpected error occurred during updating House: ",
          res.data
        );
      }
    } catch (error: any) {
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        console.error(
          "Unexpected server error occurred during updating House: ",
          error
        );
      }
    } finally {
      setLoadingUpdate(false);
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
        <form onSubmit={handleUpdateHouse}>
          <div className="mb-4">
            <FloatingLabelInput
              label="House"
              type="text"
              name="House"
              value={house}
              onChange={(e) => setHouse(e.target.value)}
              errors={errors.house}
              required
              autoFocus
            />
          </div>
          <div className="flex justify-end gap-2">
            <BackButton label="Back" path="/Houses" />

            <SubmitButton
              label="Edit House"
              loading={loadingUpdate}
              loadingLabel="Updating House..."
            />
          </div>
        </form>
      )}
    </>
  );
};

export default EditHouseForm;
