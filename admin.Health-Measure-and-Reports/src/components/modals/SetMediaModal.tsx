import { CopyOutlined, DeleteOutlined } from "@ant-design/icons";
import {
  Button,
  Empty,
  Input,
  message,
  Modal,
  Pagination,
  Popconfirm,
  Tooltip,
} from "antd";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useDebounced } from "../../redux/features/hooks";
import { useMediaListQuery } from "../../redux/features/media/mediaApi";
import { config } from "../config";
import MediaSearchAndDelete from "../shared/MediaSearchAndDelete";
import MediaUploadModal from "./MediaUploadModal";

interface SetMediaModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  onSelect?: (imageUrl: string) => void;
  onSelectImage?: (imageUrl: string) => void;
}

const SetMediaModal: React.FC<SetMediaModalProps> = ({
  open,
  setOpen,
  onSelect,
  onSelectImage,
}) => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(100);
  const [searchText, setSearchText] = useState("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Debounce search input
  const debouncedSearch = useDebounced({ searchQuery: searchText, delay: 500 });

  const { data, isFetching, refetch } = useMediaListQuery({
    page,
    limit,
    search: debouncedSearch || undefined,
  });

  const images = useMemo(
    () => (Array.isArray(data?.data?.data) ? data.data?.data : []),
    [data]
  );
  const meta = data?.data?.meta || {};

  const handleCopy = (url: string) => {
    try {
      navigator.clipboard.writeText(url);
      message.success("Image URL copied to clipboard");
    } catch {
      message.error("Failed to copy URL");
    }
  };

  const {
    isDeleting,
    handleDelete,
    handleBulkDelete,
    searchAndDeleteControls,
    selectionCheckbox,
  } = MediaSearchAndDelete({
    images,
    data,
    selectedItems,
    setSelectedItems,
    onAddNew: () => setOpenMediaUploadModal(true),
    onRefetch: refetch,
    showAddButton: false,
  });

  const [openMediaUploadModal, setOpenMediaUploadModal] = useState(false);

  const handleOk = () => {
    if (selectedImage) {
      onSelect?.(selectedImage);
      onSelectImage?.(selectedImage);
      setSelectedImage(null);
      setOpen(false);
    }
  };

  const handleCancel = () => {
    setOpen(false);
    setSelectedImage(null);
    setSearchText("");
    setSelectedItems([]);
  };

  return (
    <Modal
      open={open}
      onCancel={handleCancel}
      onOk={handleOk}
      okText="Set Image"
      okButtonProps={{ disabled: !selectedImage }}
      width="95vw"
      style={{ maxWidth: "1200px" }}
      destroyOnClose
      centered
      title="📁 Select an Image from Media"
      className="mobile-responsive-modal"
      styles={{
        body: { padding: "16px" },
      }}
      footer={[
        <Button key="cancel" onClick={handleCancel} size="middle">
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={handleOk}
          disabled={!selectedImage}
          size="middle"
        >
          Set Image
        </Button>,
      ]}
    >
      <div className="flex flex-col h-[60vh] sm:h-[65vh]">
        {/* Search and Actions Row */}
        <div className="flex flex-row gap-2 mb-4 flex-shrink-0">
          {/* Search Input */}
          <div className="flex-1 min-w-0">
            <Input
              placeholder="Search media by name..."
              prefix={<Search className="w-4 h-4 text-gray-400" />}
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                setPage(1);
              }}
              className="w-full"
              size="middle"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 flex-shrink-0">
            {/* Add New Button */}
            <Button
              onClick={() => setOpenMediaUploadModal(true)}
              type="primary"
              className="font-semibold flex items-center justify-center"
              size="middle"
            >
              <IoMdAdd className="text-base" />
              <span className="hidden xs:inline ml-1">Add</span>
            </Button>

            {/* Delete Selected Button */}
            {selectedItems.length > 0 && (
              <Popconfirm
                title={`Are you sure you want to delete ${selectedItems.length} selected image(s)?`}
                onConfirm={handleBulkDelete}
                okText="Yes"
                cancelText="No"
              >
                <Button
                  danger
                  loading={isDeleting}
                  className="font-semibold flex items-center justify-center"
                  size="middle"
                >
                  <DeleteOutlined />
                  <span className="hidden xs:inline ml-1">
                    ({selectedItems.length})
                  </span>
                </Button>
              </Popconfirm>
            )}
          </div>
        </div>

        {/* Selection Controls */}
        <div className="mb-3 sm:mb-4 flex-shrink-0 flex justify-center">
          {searchAndDeleteControls}
        </div>

        {/* Media Grid - Scrollable Area */}
        <div className="flex-1 overflow-hidden">
          {isFetching ? (
            <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-2 sm:gap-3 h-full overflow-y-auto">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="border rounded-lg overflow-hidden">
                  <Skeleton height={100} className="sm:hidden" />
                  <Skeleton height={120} className="hidden sm:block" />
                  <div className="p-1 sm:p-2">
                    <Skeleton height={14} width="80%" className="sm:hidden" />
                    <Skeleton
                      height={16}
                      width="80%"
                      className="hidden sm:block"
                    />
                    <Skeleton height={10} width="60%" className="sm:hidden" />
                    <Skeleton
                      height={12}
                      width="60%"
                      className="hidden sm:block"
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : images.length === 0 ? (
            <div className="flex justify-center items-center h-full px-4">
              <Empty description="No images found" />
            </div>
          ) : (
            <div className="h-full flex flex-col">
              {/* Scrollable Grid */}
              <div className="flex-1 overflow-y-auto">
                <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-2 sm:gap-3 p-1">
                  {images.map((img: any) => {
                    const isSelected = selectedImage === img.url;
                    const isItemSelected = selectedItems.includes(img.name);

                    return (
                      <div
                        key={img.name}
                        className={`relative rounded-lg border cursor-pointer overflow-hidden transition-all duration-500 ${
                          isSelected
                            ? "ring-[1px] ring-[#ff4778] border-[#ff4778]"
                            : isItemSelected
                            ? "ring-[1px] ring-[#ff4778] border-[#ff4778]"
                            : "border-gray-200 ring-[1px] ring-transparent hover:border-primary-100 hover:ring-primary-100 hover:shadow-xl hover:shadow-primary-50"
                        }`}
                      >
                        {/* Selection Checkbox */}
                        <div className="absolute top-1 left-1 z-30">
                          {selectionCheckbox(img.name, isItemSelected)}
                        </div>

                        {/* Action Buttons */}
                        <div className="absolute top-1 right-1 z-30 flex gap-1">
                          {/* Copy URL Button */}
                          <Tooltip title="Copy URL">
                            <CopyOutlined
                              className="text-blue-500 hover:text-blue-700 cursor-pointer text-base transition-colors duration-200 bg-white rounded p-1"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopy(img.url);
                              }}
                            />
                          </Tooltip>

                          {/* Delete Button */}
                          <Tooltip title="Delete">
                            <Popconfirm
                              title="Are you sure you want to delete this image?"
                              onConfirm={(e) => {
                                e?.stopPropagation();
                                handleDelete(img.name);
                              }}
                              okText="Yes"
                              cancelText="No"
                              okButtonProps={{ danger: true }}
                            >
                              <DeleteOutlined
                                className="text-red-500 hover:text-red-700 cursor-pointer text-base transition-colors duration-200 bg-white rounded p-1"
                                onClick={(e) => e.stopPropagation()}
                              />
                            </Popconfirm>
                          </Tooltip>
                        </div>

                        {/* Image Content - Remove hover preview */}
                        <div
                          onClick={() => setSelectedImage(img.url)}
                          className="h-20 xs:h-24 sm:h-28 md:h-32 overflow-hidden flex items-center justify-center bg-gray-50"
                        >
                          <img
                            alt={img.name}
                            src={`${config.image_access_url}${img.url}`}
                            className="max-w-full max-h-full object-contain"
                            style={{
                              backgroundColor: "#f5f5f5",
                              display: "block",
                            }}
                          />
                        </div>

                        {/* Image Info */}
                        <div className="p-1 sm:p-2 bg-white border-t">
                          <p className="text-[10px] xs:text-xs font-medium truncate mb-0.5 sm:mb-1">
                            {img.name}
                          </p>
                          {img.dimensions && (
                            <p className="text-[8px] xs:text-[10px] text-gray-500">
                              {img.dimensions.width}x{img.dimensions.height}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Pagination - Fixed at Bottom */}
              {images.length > 0 && (
                <div className="flex-shrink-0 border-t pt-2 sm:pt-4 mt-2 sm:mt-4">
                  <div className="flex justify-center px-2">
                    <Pagination
                      current={meta.page || 1}
                      pageSize={meta.limit || limit}
                      total={meta.total || 0}
                      showSizeChanger
                      pageSizeOptions={["12", "24", "48", "96"]}
                      onChange={(newPage, newLimit) => {
                        setPage(newPage);
                        setLimit(newLimit);
                      }}
                      onShowSizeChange={(_current, newLimit) => {
                        setPage(1);
                        setLimit(newLimit);
                      }}
                      responsive
                      size="small"
                      showQuickJumper={false}
                      showTotal={(total, range) => (
                        <span className="text-xs sm:text-sm text-gray-500 hidden sm:inline">
                          {range[0]}-{range[1]} of {total}
                        </span>
                      )}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {openMediaUploadModal && (
        <MediaUploadModal
          open={openMediaUploadModal}
          setOpen={setOpenMediaUploadModal}
        />
      )}
    </Modal>
  );
};

export default SetMediaModal;
