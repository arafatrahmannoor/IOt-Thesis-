import { UploadIcon } from "lucide-react";
import { useState } from "react";
import { RiDeleteBinLine } from "react-icons/ri";
import SetMediaModal from "../modals/SetMediaModal";
import AntImage from "./AntImage";

interface UploadImageProps {
  form: any;
  fieldPath: string;
}

const UploadImage = ({ form, fieldPath }: UploadImageProps) => {
  const [openSetImageModal, setOpenSetImageModal] = useState(false);
  const pathArray = fieldPath
    .split(".")
    .map((key) => (/^\d+$/.test(key) ? Number(key) : key));

  const imageUrl = form.getFieldValue(pathArray);

  const handleDelete = (e: any) => {
    e.preventDefault();
    form.setFieldValue(pathArray, null);
  };

  const handleImageSelect = (imageUrl: string) => {
    form.setFieldValue(pathArray, imageUrl);
    setOpenSetImageModal(false);
  };

  return (
    <div className="space-y-2">
      {imageUrl ? (
        <div className="relative w-[125px] h-[125px]">
          {/* Image Preview */}
          <AntImage
            width={125}
            height={125}
            src={imageUrl}
            accessurl={!imageUrl?.startsWith("http")}
            alt="Preview"
            className="w-full h-full object-cover rounded-md border border-gray-200 shadow-sm"
          />

          {/* Delete Button */}
          <button
            onClick={handleDelete}
            className="absolute top-1 right-1 bg-white border border-red-500 text-red-600 p-2 rounded-lg shadow hover:bg-red-600 hover:text-white transition-colors"
          >
            <RiDeleteBinLine size={16} />
          </button>
        </div>
      ) : (
        <div>
          <button
            type="button"
            onClick={() => setOpenSetImageModal(true)}
            className="flex flex-col items-center justify-center w-32 h-32 border border-dashed border-gray-300 rounded-lg bg-gray-50 hover:border-primary-400 transition-colors duration-200 cursor-pointer"
          >
            <UploadIcon className="w-8 h-8 text-gray-400 mb-2" />
            <span className="text-sm text-gray-500 text-center">
              Upload Image
            </span>
          </button>
        </div>
      )}

      {openSetImageModal && (
        <SetMediaModal
          open={openSetImageModal}
          setOpen={setOpenSetImageModal}
          onSelectImage={handleImageSelect}
        />
      )}
    </div>
  );
};

export default UploadImage;
