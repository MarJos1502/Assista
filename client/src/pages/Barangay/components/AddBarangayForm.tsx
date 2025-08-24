import { useState, type FC, type FormEvent } from "react";
import SubmitButton from "../../../components/Button/SubmitButton";
import FloatingLabelInput from "../../../components/Input/FloatingLabelInput";
import BarangayService from "../../../services/BarangayService";
import type { BarangayFieldErrors } from "../../../interfaces/BarangayInterface";

interface AddBarangayFormProps {
  onBarangayAdded: (message: string) => void;
  refreshKey: () => void;
}

const AddBarangayForm: FC<AddBarangayFormProps> = ({
  onBarangayAdded,
  refreshKey,
}) => {
  const [loadingStore, setLoadingStore] = useState(false);
  const [barangay, setBarangay] = useState("");
  const [errors, setErrors] = useState<BarangayFieldErrors>({});

  const handleStoreBarangay = async (e: FormEvent) => {
    try {
      e.preventDefault();

      setLoadingStore(true);

      const res = await BarangayService.storeBarangay({ barangay });

      if (res.status === 200) {
        setBarangay("");
        setErrors({});
        onBarangayAdded(res.data.message);
        refreshKey();
      } else {
        console.error(
          "Unexpected error occurred during store Barangay: ",
          res.data
        );
      }
    } catch (error: any) {
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        console.error(
          "Unexpected server error occurred during store Barangay: ",
          error
        );
      }
    } finally {
      setLoadingStore(false);
    }
  };

  return (
    <>
      <form onSubmit={handleStoreBarangay}>
        <div className="mb-4">
          <FloatingLabelInput
            label="Barangay"
            type="text"
            name="Barangay"
            value={barangay}
            onChange={(e) => setBarangay(e.target.value)}
            required
            autoFocus
            errors={errors.barangay}
          />
        </div>
        <div className="flex justify-end">
          <SubmitButton
            label="Save Barangay"
            loading={loadingStore}
            loadingLabel="Saving Barangay..."
          />
        </div>
      </form>
    </>
  );
};

export default AddBarangayForm;
