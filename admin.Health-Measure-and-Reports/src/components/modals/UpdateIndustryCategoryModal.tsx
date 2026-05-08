import { Button, Form, Input, Modal, Select } from "antd";
import React, { useEffect } from "react";
import { toast } from "react-toastify";
import { useGetIndustryCategoriesQuery } from "../../redux/features/industry/categoryApi";
import { useUpdateTalentMutation } from "../../redux/features/industry/talentApi";
import { IOurIndustryTalent } from "../../types/interfaces";
import UploadImage from "../shared/UploadImage";

interface UpdateOurIndustryTalentModalProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  data: IOurIndustryTalent;
}

const UpdateOurIndustryTalentModal: React.FC<
  UpdateOurIndustryTalentModalProps
> = ({ open, setOpen, data }) => {
  const [form] = Form.useForm();
  const [updateTalent, { isLoading }] = useUpdateTalentMutation();
  const { data: categoriesData } = useGetIndustryCategoriesQuery(undefined);
  // Pre-fill form with selected talent data
  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        name: data.name,
        position: data.position,
        category: data.category?._id || data.category,
        youtube_video_link: data.youtube_video_link,
        description: data.description,
        profile_photo: data.profile_photo,
      });
    }
  }, [data, form]);

  const handleSubmit = async (values: any) => {
    try {
      const payload = {
        id: data._id,
        data: { ...values },
      };
      const res = await updateTalent(payload).unwrap();
      if (res.success) {
        toast.success("Talent updated successfully!");
        setOpen(false);
        form.resetFields();
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update talent");
    }
  };

  return (
    <Modal
      title="Update Industry Talent"
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
            Update Talent
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateOurIndustryTalentModal;
