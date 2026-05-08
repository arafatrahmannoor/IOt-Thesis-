import { DeleteOutlined, InboxOutlined, EditOutlined } from "@ant-design/icons";
import { Card, Image, Input, message, Modal, Upload, Button, Space } from "antd";
import type { RcFile } from "antd/es/upload/interface";
import { useState } from "react";
import { useUploadImageMutation } from "../../redux/features/media/mediaApi";
import ImageCropModal from "./ImageCropModal";

const { Dragger } = Upload;

const MediaUploadModal = ({ open, setOpen }: any) => {
  const [uploadFiles, setUploadFiles] = useState<RcFile[]>([]);
  const [customNames, setCustomNames] = useState<Record<string, string>>({});
  const [uploadImage, { isLoading: isUploading }] = useUploadImageMutation();
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [currentCropFile, setCurrentCropFile] = useState<{ file: RcFile; index: number } | null>(null);

  const handleRemove = (file: RcFile) => {
    setUploadFiles((prev) => prev.filter((f) => f.uid !== file.uid));
    setCustomNames((prev) => {
      const copy = { ...prev };
      delete copy[file.name];
      return copy;
    });
  };

  const handleCropImage = (file: RcFile, index: number) => {
    setCurrentCropFile({ file, index });
    setCropModalOpen(true);
  };

  const handleCropComplete = (croppedImageBlob: Blob) => {
    if (!currentCropFile) return;

    // Create a new file from the cropped blob
    const croppedFile = new File(
      [croppedImageBlob],
      currentCropFile.file.name,
      { type: croppedImageBlob.type }
    ) as RcFile;

    // Update the file in the array
    setUploadFiles((prev) => {
      const newFiles = [...prev];
      newFiles[currentCropFile.index] = croppedFile;
      return newFiles;
    });

    // Update custom name if it exists
    if (customNames[currentCropFile.file.name]) {
      setCustomNames((prev) => ({
        ...prev,
        [croppedFile.name]: prev[currentCropFile.file.name],
      }));
    }

    setCropModalOpen(false);
    setCurrentCropFile(null);
    message.success("Image cropped successfully");
  };

  const uploadProps = {
    multiple: true,
    accept: "image/*",
    showUploadList: false,
    beforeUpload: (file: RcFile) => {
      setUploadFiles((prev) => [...prev, file]);
      setCustomNames((prev) => ({ ...prev, [file.name]: file.name }));
      return false;
    },
  };

  const handleUploadAll = async () => {
    try {
      for (const file of uploadFiles) {
        const formData = new FormData();
        formData.append("file", file);
        if (customNames[file.name]) {
          formData.append("customName", customNames[file.name]);
        }
        await uploadImage(formData).unwrap();
      }
      message.success("Images uploaded successfully");
      setOpen(false);
      setUploadFiles([]);
      setCustomNames({});
    } catch (error) {
      console.log(error);
      message.error("Image upload failed");
    }
  };

  return (
    <Modal
      open={open}
      width={800}
      title="Upload Images"
      onCancel={() => {
        setOpen(false);
        setUploadFiles([]);
        setCustomNames({});
      }}
      onOk={handleUploadAll}
      okText="Upload All"
      confirmLoading={isUploading}
    >
      <Dragger {...uploadProps} style={{ padding: 20 }}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">
          Click or drag images to this area to upload
        </p>
        <p className="ant-upload-hint">Supports multiple files.</p>
      </Dragger>

      {uploadFiles.length > 0 && (
        <div className="mt-4 space-y-4">
          {uploadFiles.map((file, index) => (
            <Card
              key={file.uid}
              className="overflow-hidden"
              cover={
                <div className="relative">
                  <Image
                    alt={file.name}
                    height={200}
                    width={"100%"}
                    src={URL.createObjectURL(file)}
                    className="object-cover"
                  />
                  <div className="absolute top-2 right-2 flex gap-2">
                    <Button
                      type="primary"
                      size="small"
                      icon={<EditOutlined />}
                      onClick={() => handleCropImage(file, index)}
                      className="bg-blue-500 hover:bg-blue-600"
                    >
                      Crop
                    </Button>
                    <Button
                      type="primary"
                      danger
                      size="small"
                      icon={<DeleteOutlined />}
                      onClick={() => handleRemove(file)}
                    />
                  </div>
                </div>
              }
            >
              <div className="mb-2">
                <label
                  htmlFor={`custom-name-${file.uid}`}
                  className="block mb-1 font-medium text-gray-700"
                >
                  Custom Filename
                </label>
                <Input
                  id={`custom-name-${file.uid}`}
                  size="large"
                  placeholder="Enter custom filename"
                  style={{
                    width: "100%",
                    borderRadius: "0",
                  }}
                  value={customNames[file.name] || ""}
                  onChange={(e) =>
                    setCustomNames((prev) => ({
                      ...prev,
                      [file.name]: e.target.value,
                    }))
                  }
                />
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Image Crop Modal */}
      {currentCropFile && (
        <ImageCropModal
          open={cropModalOpen}
          onClose={() => {
            setCropModalOpen(false);
            setCurrentCropFile(null);
          }}
          imageSrc={URL.createObjectURL(currentCropFile.file)}
          onCropComplete={handleCropComplete}
          fileName={currentCropFile.file.name}
        />
      )}
    </Modal>
  );
};

export default MediaUploadModal;
