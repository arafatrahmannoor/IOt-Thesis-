import { Button, Checkbox, Popconfirm, Tooltip } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useState } from "react";
import { HiPlus } from "react-icons/hi2";
import { useDeleteMediaMutation } from "../../redux/features/media/mediaApi";
import { toast } from "react-toastify";

interface MediaSearchAndDeleteProps {
  images: any[];
  selectedItems: string[];
  setSelectedItems: React.Dispatch<React.SetStateAction<string[]>>;
  onAddNew?: () => void;
  onRefetch?: () => void;
  showAddButton?: boolean;
  addButtonText?: string;
  className?: string;
  data: any;
}

const MediaSearchAndDelete = ({
  data,
  images,
  selectedItems,
  setSelectedItems,
  onAddNew,
  onRefetch,
  showAddButton = true,
  addButtonText = "Add New",
  className = "",
}: MediaSearchAndDeleteProps) => {
  const [deleteMedia] = useDeleteMediaMutation();
  const [isDeleting, setIsDeleting] = useState(false);

  // Single delete
  const handleDelete = async (name: string) => {
    try {
      const res = await deleteMedia(name).unwrap();
      if (res.success) {
        toast.success("Image deleted successfully");
        onRefetch?.();
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete image");
    }
  };

  // Bulk delete
  const handleBulkDelete = async () => {
    if (selectedItems.length === 0) return;
    setIsDeleting(true);

    try {
      const deletePromises = selectedItems.map((name) =>
        deleteMedia(name).unwrap()
      );
      await Promise.all(deletePromises);
      toast.success(`${selectedItems.length} image(s) deleted successfully`);
      setSelectedItems([]);
      onRefetch?.();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete some images");
    } finally {
      setIsDeleting(false);
    }
  };

  // Selection handling
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(images.map((img: any) => img.name));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (name: string, checked: boolean) => {
    if (checked) {
      setSelectedItems((prev) => [...prev, name]);
    } else {
      setSelectedItems((prev) => prev.filter((item) => item !== name));
    }
  };

  const isAllSelected =
    images.length > 0 && selectedItems.length === images.length;
  const isIndeterminate =
    selectedItems.length > 0 && selectedItems.length < images.length;

  return {
    isDeleting,
    handleDelete,
    handleBulkDelete,
    handleSelectAll,
    handleSelectItem,
    searchAndDeleteControls: (
      <div className={`flex flex-col gap-4 ${className}`}>
        {/* Controls Row */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center gap-3">
            {images.length > 0 && (
              <Checkbox
                checked={isAllSelected}
                indeterminate={isIndeterminate}
                onChange={(e) => handleSelectAll(e.target.checked)}
                className="text-sm font-medium"
              >
                <span className="ml-2 text-gray-700">
                  Select All ({selectedItems.length}/{images.length})
                </span>
              </Checkbox>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {showAddButton && onAddNew && (
              <Button
                type="primary"
                icon={<HiPlus className="text-lg" />}
                onClick={onAddNew}
                className="font-semibold flex items-center gap-2"
                size="large"
              >
                {addButtonText}
              </Button>
            )}
          </div>
          {/* Total Count */}
          <div className="text-sm text-gray-500 font-medium">
            Total: {data?.data.meta?.total || 0} items
          </div>
        </div>


      </div>
    ),
    selectionCheckbox: (
      name: string,
      checked: boolean,
      onChange?: (e: any) => void
    ) => (
      <Checkbox
        checked={checked}
        onChange={(e) => {
          e.stopPropagation();
          handleSelectItem(name, e.target.checked);
          onChange?.(e);
        }}
        style={{ transform: "scale(1.2)" }}
      />
    ),
  };
};

export default MediaSearchAndDelete;
