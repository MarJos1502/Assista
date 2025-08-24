import { useState, type FC, type FormEvent } from "react";
import SubmitButton from "../../../components/Button/SubmitButton";
import FloatingLabelInput from "../../../components/Input/FloatingLabelInput";
import HouseService from "../../../services/HouseService";
import type { HouseFieldErrors } from "../../../interfaces/HouseInterface";

interface AddHouseFormProps {
  onHouseAdded: (message: string) => void;
  refreshKey: () => void;
}

const AddHouseForm: FC<AddHouseFormProps> = ({ onHouseAdded, refreshKey }) => {
  const [loadingStore, setLoadingStore] = useState(false);
  const [house, setHouse] = useState("");
  const [errors, setErrors] = useState<HouseFieldErrors>({});

  const handleStoreHouse = async (e: FormEvent) => {
    try {
      e.preventDefault();

      setLoadingStore(true);

      const res = await HouseService.storeHouse({ house });

      if (res.status === 200) {
        setHouse("");
        setErrors({});
        onHouseAdded(res.data.message);
        refreshKey();
      } else {
        console.error(
          "Unexpected error occurred during store House: ",
          res.data
        );
      }
    } catch (error: any) {
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        console.error(
          "Unexpected server error occurred during store House: ",
          error
        );
      }
    } finally {
      setLoadingStore(false);
    }
  };

  return (
    <>
      <form onSubmit={handleStoreHouse}>
        <div className="mb-4">
          <FloatingLabelInput
            label="House"
            type="text"
            name="House"
            value={house}
            onChange={(e) => setHouse(e.target.value)}
            required
            autoFocus
            errors={errors.house}
          />
        </div>
        <div className="flex justify-end">
          <SubmitButton
            label="Save House"
            loading={loadingStore}
            loadingLabel="Saving House..."
          />
        </div>
      </form>
    </>
  );
};

export default AddHouseForm;
