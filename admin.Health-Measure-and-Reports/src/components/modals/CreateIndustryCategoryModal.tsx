import { Button, Form, Input, message, Modal } from "antd";
import { Save } from "lucide-react";
import React from "react";
import { useCreateIndustryCategoryMutation } from "../../redux/features/industry/categoryApi";

interface CreateIndustryCategoryModalProps {
  open: boolean;
  setOpen: (value: boolean) => void;
}

const CreateIndustryCategoryModal: React.FC<
  CreateIndustryCategoryModalProps
> = ({ open, setOpen }) => {
  const [form] = Form.useForm();
  const [createIndustryCategory, { isLoading }] =
    useCreateIndustryCategoryMutation();

  // Handle form submission
  const handleSubmit = async (values: {
    title: string;
    description: string;
  }) => {
    try {
      const res = await createIndustryCategory(values).unwrap();
      if (res.success) {
        message.success("Industry category created successfully");
        form.resetFields();
        setOpen(false);
      }
    } catch (error: unknown) {
      const errorMessage = error && typeof error === 'object' && 'data' in error
        ? (error as { data?: { message?: string } }).data?.message || "Failed to create industry category"
        : "Failed to create industry category";
      message.error(errorMessage);
    }
  };

  return (
    <Modal
      title="Create Industry Category"
      open={open}
      onCancel={() => setOpen(false)}
      width={600}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Title"
          name="title"
          rules={[{ required: true, message: "Please enter a category title" }]}
        >
          <Input placeholder="Enter category title" />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: "Please enter a description" }]}
        >
          <Input.TextArea rows={4} placeholder="Enter category description" />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            icon={<Save className="w-4 h-4" />}
            onClick={() => form.submit()}
            loading={isLoading}
          >
            Add Category
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateIndustryCategoryModal;
