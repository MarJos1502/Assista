import { Link } from "react-router-dom";
import { useEffect, useState, type FC } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../components/Table";
import StreetService from "../../../services/StreetService";
import Spinner from "../../../components/Spinner/Spinner";
import { BsPencilSquare, BsTrash } from "react-icons/bs";
import type { StreetColumns } from "../../../interfaces/StreetInterface";

interface StreetListProps {
  refreshKey: boolean;
}

const StreetList: FC<StreetListProps> = ({ refreshKey }) => {
  const [loadingStreets, setLoadingStreets] = useState(false);
  const [streets, setStreets] = useState<StreetColumns[]>([]);

  const handleLoadStreets = async () => {
    try {
      setLoadingStreets(true);
      const res = await StreetService.loadStreets();
      if (res.status === 200) {
        setStreets(res.data.streets);
      } else {
        console.error(
          "Unexpected error occurred during loading Streets: ",
          res.status
        );
      }
    } catch (error) {
      console.error(
        "Unexpected server error occurred during loading Streets: ",
        error
      );
    } finally {
      setLoadingStreets(false);
    }
  };
  useEffect(() => {
    handleLoadStreets();
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
                  Street
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
              {loadingStreets ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-4">
                    <Spinner size="md" />
                  </TableCell>
                </TableRow>
              ) : (
                streets.map((street, index) => (
                  <TableRow className="hover:bg-gray-100" key={index}>
                    <TableCell className="px-5 py-3 text-center">
                      {index + 1}
                    </TableCell>
                    <TableCell className="px-5 py-3 text-center">
                      {street.street}
                    </TableCell>
                    <TableCell className="px-5 py-3 text-center">
                      <div className="flex justify-center items-center gap-3">
                        <Link
                          to={`/street/edit/${street.street_id}`}
                          className="text-green-600 hover:text-green-700 p-2 rounded-lg hover:bg-green-50 transition-colors"
                          title="Edit Street"
                        >
                          <BsPencilSquare className="w-5 h-5" />
                        </Link>
                        <Link
                          to={`/street/delete/${street.street_id}`}
                          className="text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                          title="Delete Street"
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

export default StreetList;
