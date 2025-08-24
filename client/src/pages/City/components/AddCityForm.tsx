import { useState, type FC, type FormEvent } from "react";
import SubmitButton from "../../../components/Button/SubmitButton";
import FloatingLabelInput from "../../../components/Input/FloatingLabelInput";
import CityService from "../../../services/CityService";
import type { CityFieldErrors } from "../../../interfaces/CityInterface";

interface AddCityFormProps {
  onCityAdded: (message: string) => void;
  refreshKey: () => void;
}

const AddCityForm: FC<AddCityFormProps> = ({ onCityAdded, refreshKey }) => {
  const [loadingStore, setLoadingStore] = useState(false);
  const [city, setCity] = useState("");
  const [errors, setErrors] = useState<CityFieldErrors>({});

  const handleStoreCity = async (e: FormEvent) => {
    try {
      e.preventDefault();

      setLoadingStore(true);

      const res = await CityService.storeCity({ city });

      if (res.status === 200) {
        setCity("");
        setErrors({});
        onCityAdded(res.data.message);
        refreshKey();
      } else {
        console.error(
          "Unexpected error occurred during store City: ",
          res.data
        );
      }
    } catch (error: any) {
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        console.error(
          "Unexpected server error occurred during store City: ",
          error
        );
      }
    } finally {
      setLoadingStore(false);
    }
  };

  return (
    <>
      <form onSubmit={handleStoreCity}>
        <div className="mb-4">
          <FloatingLabelInput
            label="City"
            type="text"
            name="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
            autoFocus
            errors={errors.city}
          />
        </div>
        <div className="flex justify-end">
          <SubmitButton
            label="Save City"
            loading={loadingStore}
            loadingLabel="Saving City..."
          />
        </div>
      </form>
    </>
  );
};

export default AddCityForm;
