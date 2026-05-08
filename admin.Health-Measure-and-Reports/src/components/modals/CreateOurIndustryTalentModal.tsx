import { Button, Form, Input, Modal, Select } from "antd";
import React from "react";
import { toast } from "react-toastify";
import { useGetIndustryCategoriesQuery } from "../../redux/features/industry/categoryApi";
import { useCreateTalentMutation } from "../../redux/features/industry/talentApi";
import UploadImage from "../shared/UploadImage";

interface CreateOurIndustryTalentModalProps {
  open: boolean;
  setOpen: any;
}

const CreateOurIndustryTalentModal: React.FC<
  CreateOurIndustryTalentModalProps
> = ({ open, setOpen }) => {
  const [form] = Form.useForm();
  const [createTalent, { isLoading }] = useCreateTalentMutation();
  const { data: categoriesData } = useGetIndustryCategoriesQuery(undefined);
  const handleSubmit = async (values: any) => {
    try {
      const res = await createTalent(values).unwrap();
      if (res.success) {
        form.resetFields();
        setOpen(false);
        toast.success("Talent created successfully!");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create talent");
    }
  };

  return (
    <Modal
      title="Create Industry Talent"
      open={open}
      onCancel={() => setOpen(false)}
      width={600}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please enter name" }]}
        >
          <Input placeholder="Enter name" />
        </Form.Item>

        <Form.Item
          label="Position"
          name="position"
          rules={[{ required: true, message: "Please enter position" }]}
        >
          <Input placeholder="Enter position" />
        </Form.Item>

        <Form.Item
          label="Category"
          name="category"
          rules={[{ required: true, message: "Please select category" }]}
        >
          <Select
            placeholder="Select category"
            options={categoriesData?.data?.map((cat: any) => ({
              label: cat.title,
              value: cat._id,
            }))}
          />
        </Form.Item>

        <Form.Item
          label="YouTube Video Link"
          name="youtube_video_link"
          rules={[
            { required: true, message: "Please enter YouTube video link" },
            { type: "url", message: "Enter a valid URL" },
          ]}
        >
          <Input placeholder="Enter YouTube link" />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: "Please enter description" }]}
        >
          <Input.TextArea rows={4} placeholder="Enter description" />
        </Form.Item>

        <Form.Item
          name="profile_photo"
          label="Profile Photo"
          tooltip={`Required dimensions: 600 x 600\nAccepted formats: JPG, PNG, JPEG, GIF`}
          className="w-full"
          rules={[{ required: true }]}
        >
          <UploadImage form={form} fieldPath="profile_photo" />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            onClick={() => form.submit()}
            loading={isLoading}
          >
            Create Talent
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateOurIndustryTalentModal;
