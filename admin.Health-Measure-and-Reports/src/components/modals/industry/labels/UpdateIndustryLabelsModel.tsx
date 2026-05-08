import { Button, Form, Input, message, Modal } from "antd";
import { Save } from "lucide-react";
import React, { useEffect } from "react";
import { useUpdateIndustryLabelsMutation } from "../../../../redux/features/industry/labelsApi";

interface UpdateIndustryLabelsModalProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  data: { _id: string; name: string; description: string };
}

const UpdateIndustryLabelsModal: React.FC<UpdateIndustryLabelsModalProps> = ({
  open,
  setOpen,
  data,
}) => {
  const [form] = Form.useForm();
  const [updateIndustryLabels, { isLoading }] =
    useUpdateIndustryLabelsMutation();

  // Pre-fill form with selected label data
  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        name: data.name,
        description: data.description,
      });
    }
  }, [data, form]);

  // Handle form submission
  const handleSubmit = async (values: {
    name: string;
    description: string;
  }) => {
    try {
      const payload = {
        id: data._id,
        data: { ...values },
      };
      const res: any = await updateIndustryLabels(payload).unwrap();
      if (res.success) {
        message.success("Industry label updated successfully");
        form.resetFields();
        setOpen(false);
      }
    } catch (error: any) {
      message.error(error?.data?.message || "Failed to update industry label");
    }
  };

  return (
    <Modal
      title="Update Industry Label"
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
          <Input placeholder="Enter label name" />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true, message: "Please enter a description" }]}
        >
          <Input.TextArea rows={4} placeholder="Enter label description" />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            icon={<Save className="w-4 h-4" />}
            onClick={() => form.submit()}
            loading={isLoading}
          >
            Update Label
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateIndustryLabelsModal;
