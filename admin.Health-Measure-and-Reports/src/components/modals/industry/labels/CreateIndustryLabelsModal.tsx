import { Button, Form, Input, message, Modal } from "antd";
import { Save } from "lucide-react";
import React from "react";
import { useCreateIndustryLabelsMutation } from "../../../../redux/features/industry/labelsApi";

interface CreateIndustryLabelsModalProps {
  open: boolean;
  setOpen: (value: boolean) => void;
}

const CreateIndustryLabelsModal: React.FC<CreateIndustryLabelsModalProps> = ({
  open,
  setOpen,
}) => {
  const [form] = Form.useForm();
  const [createIndustryLabels, { isLoading }] =
    useCreateIndustryLabelsMutation();

  // Handle form submission
  const handleSubmit = async (values: {
    title: string;
    description: string;
  }) => {
    try {
      const res: any = await createIndustryLabels(values).unwrap();
      if (res.success) {
        message.success("Industry label created successfully");
        form.resetFields();
        setOpen(false);
      }
    } catch (error: any) {
      message.error(error?.data?.message || "Failed to create industry label");
    }
  };

  return (
    <Modal
      title="Create Industry Label"
      open={open}
      onCancel={() => setOpen(false)}
      width={600}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please enter a label name" }]}
        >
          <Input placeholder="Enter label name " />
        </Form.Item>

        <Form.Item label="Description" name="description">
          <Input.TextArea rows={4} placeholder="Enter label description" />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            icon={<Save className="w-4 h-4" />}
            onClick={() => form.submit()}
            loading={isLoading}
          >
            Add Label
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateIndustryLabelsModal;
