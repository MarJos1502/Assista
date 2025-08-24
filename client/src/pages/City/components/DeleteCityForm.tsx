import { useEffect, useState, type FormEvent } from "react";
import BackButton from "../../../components/Button/BackButton";
import SubmitButton from "../../../components/Button/SubmitButton";
import FloatingLabelInput from "../../../components/Input/FloatingLabelInput";
import { useNavigate, useParams } from "react-router-dom";
import CityService from "../../../services/CityService";
import Spinner from "../../../components/Spinner/Spinner";

const DeleteCityForm = () => {
  const [loadingGet, setLoadingGet] = useState(false);
  const [loadingDestroy, setLoadingDestroy] = useState(false);
  const [city, setCity] = useState("");

  const { city_id } = useParams();
  const navigate = useNavigate();

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

  const handleDestroyCity = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setLoadingDestroy(true);

      const res = await CityService.destroyCity(city_id!);

      if (res.status === 200) {
        setCity("");
        navigate("/Cities", { state: { message: res.data.message } });
      } else {
        console.error(
          "Unexpected error occurred during deleting City: ",
          res.status
        );
      }
    } catch (error) {
      console.error(
        "Unexpected server error occurred during deleting City: ",
        error
      );
    } finally {
      setLoadingDestroy(false);
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
        <form onSubmit={handleDestroyCity}>
          <div className="mb-4">
            <FloatingLabelInput
              label="City"
              type="text"
              name="City"
              value={city}
              readOnly
            />
          </div>
          <div className="flex justify-end gap-2">
            {!loadingDestroy && <BackButton label="Back" path="/Cities" />}
            <SubmitButton
              label="Delete City"
              className="bg-red-600 hover:bg-red-700"
              loading={loadingDestroy}
              loadingLabel="Deleting City..."
            />
          </div>
        </form>
      )}
    </>
  );
};

export default DeleteCityForm;
