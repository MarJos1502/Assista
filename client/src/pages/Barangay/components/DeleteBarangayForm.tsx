import { useEffect, useState, type FormEvent } from "react";
import BackButton from "../../../components/Button/BackButton";
import SubmitButton from "../../../components/Button/SubmitButton";
import FloatingLabelInput from "../../../components/Input/FloatingLabelInput";
import { useNavigate, useParams } from "react-router-dom";
import BarangayService from "../../../services/BarangayService";
import Spinner from "../../../components/Spinner/Spinner";

const DeleteBarangayForm = () => {
  const [loadingGet, setLoadingGet] = useState(false);
  const [loadingDestroy, setLoadingDestroy] = useState(false);
  const [barangay, setBarangay] = useState("");

  const { barangay_id } = useParams();
  const navigate = useNavigate();

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

  const handleDestroyBarangay = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setLoadingDestroy(true);

      const res = await BarangayService.destroyBarangay(barangay_id!);

      if (res.status === 200) {
        setBarangay("");
        navigate("/Barangays", { state: { message: res.data.message } });
      } else {
        console.error(
          "Unexpected error occurred during deleting Barangay: ",
          res.status
        );
      }
    } catch (error) {
      console.error(
        "Unexpected server error occurred during deleting Barangay: ",
        error
      );
    } finally {
      setLoadingDestroy(false);
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
        <form onSubmit={handleDestroyBarangay}>
          <div className="mb-4">
            <FloatingLabelInput
              label="Barangay"
              type="text"
              name="Barangay"
              value={barangay}
              readOnly
            />
          </div>
          <div className="flex justify-end gap-2">
            {!loadingDestroy && <BackButton label="Back" path="/Barangays" />}
            <SubmitButton
              label="Delete Barangay"
              className="bg-red-600 hover:bg-red-700"
              loading={loadingDestroy}
              loadingLabel="Deleting Barangay..."
            />
          </div>
        </form>
      )}
    </>
  );
};

export default DeleteBarangayForm;
