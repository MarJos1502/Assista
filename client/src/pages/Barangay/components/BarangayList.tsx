import { Link } from "react-router-dom";
import { useEffect, useState, type FC } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../components/Table";
import BarangayService from "../../../services/BarangayService";
import Spinner from "../../../components/Spinner/Spinner";
import { BsPencilSquare, BsTrash } from "react-icons/bs";
import type { BarangayColumns } from "../../../interfaces/BarangayInterface";

interface BarangayListProps {
  refreshKey: boolean;
}

const BarangayList: FC<BarangayListProps> = ({ refreshKey }) => {
  const [loadingBarangays, setLoadingBarangays] = useState(false);
  const [barangays, setBarangays] = useState<BarangayColumns[]>([]);

  const handleLoadBarangays = async () => {
    try {
      setLoadingBarangays(true);
      const res = await BarangayService.loadBarangays();
      if (res.status === 200) {
        setBarangays(res.data.barangays);
      } else {
        console.error(
          "Unexpected error occurred during loading Barangays: ",
          res.status
        );
      }
    } catch (error) {
      console.error(
        "Unexpected server error occurred during loading Barangays: ",
        error
      );
    } finally {
      setLoadingBarangays(false);
    }
  };
  useEffect(() => {
    handleLoadBarangays();
  }, [refreshKey]);

  return (
    <>
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <div className="max-w-full max-h-[calc(100vh-15)] overflow-x-auto">
          <Table>
            <TableHeader className="border-b border-gray-100 bg-blue-600 text-white sticky top-0 z-30 text-xs">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-center"
                >
                  No.
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-center"
                >
                  Barangay
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-center"
                >
                  Action
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 text-sm text-gray-500">
              {loadingBarangays ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-4">
                    <Spinner size="md" />
                  </TableCell>
                </TableRow>
              ) : (
                barangays.map((barangay, index) => (
                  <TableRow className="hover:bg-gray-100" key={index}>
                    <TableCell className="px-5 py-3 text-center">
                      {index + 1}
                    </TableCell>
                    <TableCell className="px-5 py-3 text-center">
                      {barangay.barangay}
                    </TableCell>
                    <TableCell className="px-5 py-3 text-center">
                      <div className="flex justify-center items-center gap-3">
                        <Link
                          to={`/Barangay/edit/${barangay.barangay_id}`}
                          className="text-green-600 hover:text-green-700 p-2 rounded-lg hover:bg-green-50 transition-colors"
                          title="Edit Barangay"
                        >
                          <BsPencilSquare className="w-5 h-5" />
                        </Link>
                        <Link
                          to={`/Barangay/delete/${barangay.barangay_id}`}
                          className="text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                          title="Delete Barangay"
                        >
                          <BsTrash className="w-5 h-5" />
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
};

export default BarangayList;
