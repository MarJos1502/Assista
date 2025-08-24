import { useEffect, useState, type FormEvent } from "react";
import BackButton from "../../../components/Button/BackButton";
import SubmitButton from "../../../components/Button/SubmitButton";
import FloatingLabelInput from "../../../components/Input/FloatingLabelInput";
import { useNavigate, useParams } from "react-router-dom";
import StreetService from "../../../services/StreetService";
import Spinner from "../../../components/Spinner/Spinner";

const DeleteStreetForm = () => {
  const [loadingGet, setLoadingGet] = useState(false);
  const [loadingDestroy, setLoadingDestroy] = useState(false);
  const [street, setStreet] = useState("");

  const { street_id } = useParams();
  const navigate = useNavigate();

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

  const handleDestroyStreet = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setLoadingDestroy(true);

      const res = await StreetService.destroyStreet(street_id!);

      if (res.status === 200) {
        setStreet("");
        navigate("/Streets", { state: { message: res.data.message } });
      } else {
        console.error(
          "Unexpected error occurred during deleting Street: ",
          res.status
        );
      }
    } catch (error) {
      console.error(
        "Unexpected server error occurred during deleting Street: ",
        error
      );
    } finally {
      setLoadingDestroy(false);
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
        <form onSubmit={handleDestroyStreet}>
          <div className="mb-4">
            <FloatingLabelInput
              label="Street"
              type="text"
              name="Street"
              value={street}
              readOnly
            />
          </div>
          <div className="flex justify-end gap-2">
            {!loadingDestroy && <BackButton label="Back" path="/Streets" />}
            <SubmitButton
              label="Delete Street"
              className="bg-red-600 hover:bg-red-700"
              loading={loadingDestroy}
              loadingLabel="Deleting Street..."
            />
          </div>
        </form>
      )}
    </>
  );
};

export default DeleteStreetForm;
