import { useEffect, useState, type FC, type FormEvent } from "react";
import BackButton from "../../../components/Button/BackButton";
import SubmitButton from "../../../components/Button/SubmitButton";
import FloatingLabelInput from "../../../components/Input/FloatingLabelInput";
import StreetService from "../../../services/StreetService";
import { useParams } from "react-router-dom";
import Spinner from "../../../components/Spinner/Spinner";
import type { StreetFieldErrors } from "../../../interfaces/StreetInterface";

interface EditStreetFormProps {
  onStreetUpdated: (message: string) => void;
}

const EditStreetForm: FC<EditStreetFormProps> = ({ onStreetUpdated }) => {
  const { street_id } = useParams();
  const [loadingGet, setLoadingGet] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [street, setStreet] = useState("");
  const [errors, setErrors] = useState<StreetFieldErrors>({});

  const handleGetStreet = async (streetId: string | number) => {
    try {
      setLoadingGet(true);
      const res = await StreetService.getStreet(streetId);

      if (res.status === 200) {
        setStreet(res.data.street.street);
      } else {
        console.error(
          "Unexpected error occurred during getting Street: ",
          res.data
        );
      }
    } catch (error) {
      console.error(
        "Unexpected server error occurred during getting Street: ",
        error
      );
    } finally {
      setLoadingGet(false);
    }
  };

  const handleUpdateStreet = async (e: FormEvent) => {
    try {
      e.preventDefault();

      setLoadingUpdate(true);

      const res = await StreetService.updateStreet(street_id!, { street });

      if (res.status === 200) {
        setErrors({});
        setStreet(res.data.street.street);
        onStreetUpdated(res.data.message);
      } else {
        console.error(
          "Unexpected error occurred during updating Street: ",
          res.data
        );
      }
    } catch (error: any) {
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        console.error(
          "Unexpected server error occurred during updating Street: ",
          error
        );
      }
    } finally {
      setLoadingUpdate(false);
    }
  };

  useEffect(() => {
    if (street_id) {
      const parseStreetId = parseInt(street_id);
      handleGetStreet(parseStreetId);
    } else {
      console.error(
        "Unexpected parameter error occurred during getting Street:",
        street_id
      );
    }
  }, [street_id]);

  return (
    <>
      {loadingGet ? (
        <div className="flex justify-center items-center mt-52">
          <Spinner size="lg" />
        </div>
      ) : (
        <form onSubmit={handleUpdateStreet}>
          <div className="mb-4">
            <FloatingLabelInput
              label="Street"
              type="text"
              name="Street"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              errors={errors.street}
              required
              autoFocus
            />
          </div>
          <div className="flex justify-end gap-2">
            <BackButton label="Back" path="/Streets" />

            <SubmitButton
              label="Edit Street"
              loading={loadingUpdate}
              loadingLabel="Updating Street..."
            />
          </div>
        </form>
      )}
    </>
  );
};

export default EditStreetForm;
