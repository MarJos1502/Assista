import { useEffect, useState, type FC, type FormEvent } from "react";
import BackButton from "../../../components/Button/BackButton";
import SubmitButton from "../../../components/Button/SubmitButton";
import FloatingLabelInput from "../../../components/Input/FloatingLabelInput";
import CityService from "../../../services/CityService";
import { useParams } from "react-router-dom";
import Spinner from "../../../components/Spinner/Spinner";
import type { CityFieldErrors } from "../../../interfaces/CityInterface";

interface EditCityFormProps {
  onCityUpdated: (message: string) => void;
}

const EditCityForm: FC<EditCityFormProps> = ({ onCityUpdated }) => {
  const { city_id } = useParams();
  const [loadingGet, setLoadingGet] = useState(false);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [city, setCity] = useState("");
  const [errors, setErrors] = useState<CityFieldErrors>({});

  const handleGetCity = async (cityId: string | number) => {
    try {
      setLoadingGet(true);
      const res = await CityService.getCity(cityId);

      if (res.status === 200) {
        setCity(res.data.city.city);
      } else {
        console.error(
          "Unexpected error occurred during getting City: ",
          res.data
        );
      }
    } catch (error) {
      console.error(
        "Unexpected server error occurred during getting City: ",
        error
      );
    } finally {
      setLoadingGet(false);
    }
  };

  const handleUpdateCity = async (e: FormEvent) => {
    try {
      e.preventDefault();

      setLoadingUpdate(true);

      const res = await CityService.updateCity(city_id!, { city });

      if (res.status === 200) {
        setErrors({});
        setCity(res.data.city.city);
        onCityUpdated(res.data.message);
      } else {
        console.error(
          "Unexpected error occurred during updating City: ",
          res.data
        );
      }
    } catch (error: any) {
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        console.error(
          "Unexpected server error occurred during updating City: ",
          error
        );
      }
    } finally {
      setLoadingUpdate(false);
    }
  };

  useEffect(() => {
    if (city_id) {
      const parseCityId = parseInt(city_id);
      handleGetCity(parseCityId);
    } else {
      console.error(
        "Unexpected parameter error occurred during getting City:",
        city_id
      );
    }
  }, [city_id]);

  return (
    <>
      {loadingGet ? (
        <div className="flex justify-center items-center mt-52">
          <Spinner size="lg" />
        </div>
      ) : (
        <form onSubmit={handleUpdateCity}>
          <div className="mb-4">
            <FloatingLabelInput
              label="City"
              type="text"
              name="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              errors={errors.city}
              required
              autoFocus
            />
          </div>
          <div className="flex justify-end gap-2">
            <BackButton label="Back" path="/cities" />

            <SubmitButton
              label="Edit City"
              loading={loadingUpdate}
              loadingLabel="Updating City..."
            />
          </div>
        </form>
      )}
    </>
  );
};

export default EditCityForm;
