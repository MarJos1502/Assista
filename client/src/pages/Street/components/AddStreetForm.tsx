import { useState, type FC, type FormEvent } from "react";
import SubmitButton from "../../../components/Button/SubmitButton";
import FloatingLabelInput from "../../../components/Input/FloatingLabelInput";
import StreetService from "../../../services/StreetService";
import type { StreetFieldErrors } from "../../../interfaces/StreetInterface";

interface AddStreetFormProps {
  onStreetAdded: (message: string) => void;
  refreshKey: () => void;
}

const AddStreetForm: FC<AddStreetFormProps> = ({
  onStreetAdded,
  refreshKey,
}) => {
  const [loadingStore, setLoadingStore] = useState(false);
  const [street, setStreet] = useState("");
  const [errors, setErrors] = useState<StreetFieldErrors>({});

  const handleStoreStreet = async (e: FormEvent) => {
    try {
      e.preventDefault();

      setLoadingStore(true);

      const res = await StreetService.storeStreet({ street });

      if (res.status === 200) {
        setStreet("");
        setErrors({});
        onStreetAdded(res.data.message);
        refreshKey();
      } else {
        console.error(
          "Unexpected error occurred during store Street: ",
          res.data
        );
      }
    } catch (error: any) {
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        console.error(
          "Unexpected server error occurred during store Street: ",
          error
        );
      }
    } finally {
      setLoadingStore(false);
    }
  };

  return (
    <>
      <form onSubmit={handleStoreStreet}>
        <div className="mb-4">
          <FloatingLabelInput
            label="Street"
            type="text"
            name="Street"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            required
            autoFocus
            errors={errors.street}
          />
        </div>
        <div className="flex justify-end">
          <SubmitButton
            label="Save Street"
            loading={loadingStore}
            loadingLabel="Saving Street..."
          />
        </div>
      </form>
    </>
  );
};

export default AddStreetForm;
