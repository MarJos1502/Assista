import { useEffect, useState, type FC, type FormEvent } from "react";
import BackButton from "../../../components/Button/BackButton";
import SubmitButton from "../../../components/Button/SubmitButton";
import FloatingLabelInput from "../../../components/Input/FloatingLabelInput";
import BarangayService from "../../../services/BarangayService";
import { useParams } from "react-router-dom";
import Spinner from "../../../components/Spinner/Spinner";
import type { BarangayFieldErrors } from "../../../interfaces/BarangayInterface";

interface EditBarangayFormProps {
  onBarangayUpdated: (message: string) => void;
}

const EditBarangayForm: FC<EditBarangayFormProps> = ({ onBarangayUpdated }) => {
  const { barangay_id } = useParams();
  const [loadingGet, setLoadingGet] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [barangay, setBarangay] = useState("");
  const [errors, setErrors] = useState<BarangayFieldErrors>({});

  const handleGetBarangay = async (barangayId: string | number) => {
    try {
      setLoadingGet(true);
      const res = await BarangayService.getBarangay(barangayId);

      if (res.status === 200) {
        setBarangay(res.data.barangay.barangay);
      } else {
        console.error(
          "Unexpected error occurred during getting Barangay: ",
          res.data
        );
      }
    } catch (error) {
      console.error(
        "Unexpected server error occurred during getting Barangay: ",
        error
      );
    } finally {
      setLoadingGet(false);
    }
  };

  const handleUpdateBarangay = async (e: FormEvent) => {
    try {
      e.preventDefault();

      setLoadingUpdate(true);

      const res = await BarangayService.updateBarangay(barangay_id!, {
        barangay,
      });

      if (res.status === 200) {
        setErrors({});
        setBarangay(res.data.barangay.barangay);
        onBarangayUpdated(res.data.message);
      } else {
        console.error(
          "Unexpected error occurred during updating Barangay: ",
          res.data
        );
      }
    } catch (error: any) {
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        console.error(
          "Unexpected server error occurred during updating Barangay: ",
          error
        );
      }
    } finally {
      setLoadingUpdate(false);
    }
  };

  useEffect(() => {
    if (barangay_id) {
      const parseBarangayId = parseInt(barangay_id);
      handleGetBarangay(parseBarangayId);
    } else {
      console.error(
        "Unexpected parameter error occurred during getting Barangay:",
        barangay_id
      );
    }
  }, [barangay_id]);

  return (
    <>
      {loadingGet ? (
        <div className="flex justify-center items-center mt-52">
          <Spinner size="lg" />
        </div>
      ) : (
        <form onSubmit={handleUpdateBarangay}>
          <div className="mb-4">
            <FloatingLabelInput
              label="Barangay"
              type="text"
              name="Barangay"
              value={barangay}
              onChange={(e) => setBarangay(e.target.value)}
              errors={errors.barangay}
              required
              autoFocus
            />
          </div>
          <div className="flex justify-end gap-2">
            <BackButton label="Back" path="/Barangays" />

            <SubmitButton
              label="Edit Barangay"
              loading={loadingUpdate}
              loadingLabel="Updating Barangay..."
            />
          </div>
        </form>
      )}
    </>
  );
};

export default EditBarangayForm;
