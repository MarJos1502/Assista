import { useCallback, useEffect, useRef, useState, type FC } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../components/Table";

import { BsPencilSquare, BsTrash } from "react-icons/bs";

import type { ApplicantColumns } from "../../../interfaces/ApplicantInterface";
import FloatingLabelInput from "../../../components/Input/FloatingLabelInput";
import Spinner from "../../../components/Spinner/Spinner";
import ApplicantService from "../../../services/ApplicantService";
import Modal from "../../../components/Modal";

interface ApplicantListProps {
  onAddApplicant: () => void;
  onEditApplicant: (applicant: ApplicantColumns) => void;
  onDeleteApplicant: (applicant: ApplicantColumns) => void;
  refreshKey: boolean;
}

const ApplicantList: FC<ApplicantListProps> = ({
  onAddApplicant,
  onEditApplicant,
  onDeleteApplicant,
  refreshKey,
}) => {
  const [loadingApplicants, setLoadingApplicants] = useState(false);
  const [applicants, setApplicants] = useState<ApplicantColumns[]>([]);
  const [applicantsTableCurrentPage, setApplicantsTableCurrentPage] =
    useState(1);
  const [applicantsTableLastPages, setApplicantsTableLastPages] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [search, setSearch] = useState("");
  const [debounceSearch, setDebounceSearch] = useState("");

  const tableRef = useRef<HTMLDivElement>(null);

  // State for file viewer modal
  const [isFileModalOpen, setIsFileModalOpen] = useState(false);
  const [currentFileUrl, setCurrentFileUrl] = useState<string | null>(null);

  const handleLoadApplicants = async (
    page: number,
    append = false,
    search: string
  ) => {
    try {
      setLoadingApplicants(true);

      const res = await ApplicantService.loadApplicants(page, search);

      if (res.status === 200) {
        const applicantsData =
          res.data.applicants.data || res.data.applicants || [];
        const lastPage =
          res.data.applicants.last_page ||
          res.data.last_page ||
          applicantsTableLastPages ||
          1;

        setApplicants(
          append ? [...applicants, ...applicantsData] : applicantsData
        );
        setApplicantsTableCurrentPage(page);
        setApplicantsTableLastPages(lastPage);
        setHasMore(page < lastPage);
      } else {
        setApplicants(append ? applicants : []);
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error loading applicants:", error); // Log the error for debugging
      // throw error; // Re-throwing the error can break the component; better to handle gracefully
    } finally {
      setLoadingApplicants(false);
    }
  };

  const handleScroll = useCallback(() => {
    const ref = tableRef.current;

    if (
      ref &&
      ref.scrollTop + ref.clientHeight >= ref.scrollHeight - 10 && // Check if near bottom
      hasMore &&
      !loadingApplicants
    ) {
      handleLoadApplicants(
        applicantsTableCurrentPage + 1,
        true,
        debounceSearch
      );
    }
  }, [hasMore, loadingApplicants, applicantsTableCurrentPage, debounceSearch]);

  // Function to format applicant's full name
  const handleApplicantFullNameFormat = (applicant: ApplicantColumns) => {
    let fullName = "";

    if (applicant.middle_name) {
      fullName = `${applicant.last_name}, ${
        applicant.first_name
      } ${applicant.middle_name.charAt(0)}.`;
    } else {
      fullName = `${applicant.last_name}, ${applicant.first_name}`;
    }

    if (applicant.suffix_name) {
      fullName += ` ${applicant.suffix_name}`;
    }

    return fullName;
  };

  useEffect(() => {
    const ref = tableRef.current;

    if (ref) {
      ref.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (ref) {
        ref.removeEventListener("scroll", handleScroll);
      }
    };
  }, [handleScroll]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      // Example format: YYYY-MM-DD
      return date.toISOString().split("T")[0];
    } catch (e) {
      console.error("Invalid date string:", dateString, e);
      return dateString; // Return original if parsing fails
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounceSearch(search);
    }, 800);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setApplicants([]);
    setApplicantsTableCurrentPage(1);
    setHasMore(true);

    handleLoadApplicants(1, false, debounceSearch);
  }, [refreshKey, debounceSearch]);

  // Functions for File Viewer Modal
  const openFileModal = (url: string) => {
    setCurrentFileUrl(url);
    setIsFileModalOpen(true);
  };

  const closeFileModal = () => {
    setIsFileModalOpen(false);
    setCurrentFileUrl(null);
  };

  return (
    <>
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <div
          ref={tableRef}
          className="relative max-w-full max-h-[calc(100vh-8.5rem)] overflow-x-auto"
        >
          <Table>
            <caption className="mb-4">
              <div className="border-b border-gray-100">
                <div className="p-4 flex justify-between">
                  <div className="w-64">
                    <FloatingLabelInput
                      label="Search Applicants"
                      type="text"
                      name="search"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      autoFocus
                    />
                  </div>
                  <button
                    type="button"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-lg transition-colors cursor-pointer"
                    onClick={onAddApplicant}
                  >
                    Add Applicant
                  </button>
                </div>
              </div>
            </caption>
            <TableHeader className="border-b border-gray-200 bg-blue-600 text-white sticky top-0 z-10 text-xs">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-center"
                >
                  No.
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-start"
                >
                  Full Name
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-start"
                >
                  Gender
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-start"
                >
                  Crisis
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-start"
                >
                  Birth Date
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-start" // Added for File Column
                >
                  File
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 font-medium text-center"
                >
                  Action
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 text-gray-500 text-sm">
              {applicants.length > 0 ? (
                applicants.map((applicant, index) => (
                  <TableRow
                    className="hover:bg-gray-100"
                    key={applicant.applicant_id}
                  >
                    <TableCell className="px-4 py-3 text-center">
                      {index + 1}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start">
                      {handleApplicantFullNameFormat(applicant)}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start">
                      {/* Accessing nested gender property */}
                      {applicant.gender.gender}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start">
                      {/* Accessing nested crisis property */}
                      {applicant.crisis.crisis}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start">
                      {formatDate(applicant.birth_date)}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start">
                      {" "}
                      {/* Cell for File */}
                      {applicant.attached_file_url ? (
                        <button
                          onClick={() =>
                            openFileModal(applicant.attached_file_url!)
                          }
                          className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
                        >
                          View File
                        </button>
                      ) : (
                        <span className="text-gray-500">No File</span>
                      )}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-center">
                      <div className="flex gap-3 justify-center">
                        <button
                          type="button"
                          className="text-green-600 hover:text-green-700 p-2 rounded-lg hover:bg-green-50 transition-colors"
                          onClick={() => onEditApplicant(applicant)}
                          title="Edit Applicant"
                        >
                          <BsPencilSquare className="w-5 h-5" />
                        </button>
                        <button
                          type="button"
                          className="text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                          onClick={() => onDeleteApplicant(applicant)}
                          title="Delete Applicant"
                        >
                          <BsTrash className="w-5 h-5" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : !loadingApplicants && applicants.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7} // Increased colspan due to new column
                    className="px-4 py-3 text-center font-medium"
                  >
                    No Records Found
                  </TableCell>
                </TableRow>
              ) : null}
              {loadingApplicants && applicants.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="px-4 py-3 text-center">
                    {" "}
                    {/* Increased colspan */}
                    <Spinner size="md" />
                  </TableCell>
                </TableRow>
              )}
              {loadingApplicants && applicants.length > 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="px-4 py-3 text-center">
                    {" "}
                    {/* Increased colspan */}
                    <Spinner size="md" />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* File Viewer Modal */}
      <Modal isOpen={isFileModalOpen} onClose={closeFileModal} showCloseButton>
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            View Attached File
          </h2>
          {currentFileUrl ? (
            currentFileUrl.endsWith(".pdf") ? (
              <iframe
                src={currentFileUrl}
                width="100%"
                height="500px"
                style={{ border: "none" }}
                title="Attached PDF File"
              >
                This browser does not support PDFs. Please download the PDF to
                view it:{" "}
                <a
                  href={currentFileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Download PDF
                </a>
              </iframe>
            ) : (
              <img
                src={currentFileUrl}
                alt="Attached File"
                className="max-w-full h-auto rounded-lg shadow-md"
                onError={(e) => {
                  (e.target as HTMLImageElement).onerror = null;
                  (e.target as HTMLImageElement).src =
                    "https://placehold.co/400x300/e0e0e0/555555?text=File+Not+Found";
                }}
              />
            )
          ) : (
            <p className="text-gray-600">No file to display.</p>
          )}
          <div className="mt-6 text-center">
            <a
              href={currentFileUrl || "#"}
              target="_blank"
              rel="noopener noreferrer"
              download={
                currentFileUrl ? currentFileUrl.split("/").pop() : undefined
              }
              className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition duration-200 font-semibold mr-2"
            >
              Download File
            </a>
            <button
              onClick={closeFileModal}
              className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg shadow-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition duration-200 font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ApplicantList;
