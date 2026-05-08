import { Button, Form, Input, Modal, Select } from "antd";
import React from "react";
import { toast } from "react-toastify";
import { useCreateOurTeamMutation } from "../../redux/features/ourTeam/ourTeamApi";
import UploadImage from "../shared/UploadImage";

export interface IOurTeam {
  category: string;
  name: string;
  email: string;
  phone?: string;
  position: string;
  bio: string;
  photo: string;
  socials_links?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };
}

interface CreateOurTeamModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

// Categories
const categoryOptions = [
  { value: "Founder", label: "Founder" },
  { value: "People Operations", label: "People Operations" },
  { value: "Recruitment", label: "Recruitment" },
  { value: "Sales & Marketing", label: "Sales & Marketing" },
  { value: "Information & Technology", label: "Information & Technology" },
  { value: "Leadership", label: "Leadership" },
  { value: "Advisory", label: "Advisory" },
  { value: "Human Resources", label: "Human Resources" },
  { value: "Finance", label: "Finance" },
  { value: "Operations", label: "Operations" },
  { value: "Customer Success", label: "Customer Success" },
  { value: "Business Development", label: "Business Development" },
  { value: "Design", label: "Design" },
  { value: "Engineering", label: "Engineering" },
  { value: "Product Management", label: "Product Management" },
  { value: "Legal", label: "Legal" },
  { value: "Data & Analytics", label: "Data & Analytics" },
  { value: "Content & Communications", label: "Content & Communications" },
  { value: "Quality Assurance", label: "Quality Assurance" },
  { value: "Training & Development", label: "Training & Development" },
];

const CreateOurTeamModal: React.FC<CreateOurTeamModalProps> = ({
  open,
  setOpen,
}) => {
  const [form] = Form.useForm<IOurTeam>();
  const [createTeamMember, { isLoading }] = useCreateOurTeamMutation();

  const handleSubmit = async (values: IOurTeam) => {
    try {
      const res = await createTeamMember(values).unwrap();
      if (res.success) {
        form.resetFields();
        setOpen(false);
        toast.success("Team member created successfully!");
      }
    } catch (error: any) {
      if (error?.data?.err?.issues && Array.isArray(error.data.err.issues)) {
        const fieldsErrors = error.data.err.issues.map((err: any) => ({
          name: err.path.slice(1), // remove "body" from path
          errors: [err.message],
        }));
        form.setFields(fieldsErrors);
      } else {
        toast.error(error?.data?.message || "Failed to create team member");
      }
    }
  };

  return (
    <Modal
      title="Add New Team Member"
      open={open}
      onCancel={() => setOpen(false)}
      width={700}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please enter name" }]}
          >
            <Input placeholder="Enter full name" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter email" },
              { type: "email", message: "Enter a valid email" },
            ]}
          >
            <Input placeholder="Enter email address" />
          </Form.Item>

          <Form.Item
            label="Phone"
            name="phone"
            rules={[{ required: true, message: "Please enter phone number" }]}
          >
            <Input placeholder="Enter phone number" />
          </Form.Item>

          <Form.Item
            label="Position"
            name="position"
            rules={[{ required: true, message: "Please enter position" }]}
          >
            <Input placeholder="Enter job position" />
          </Form.Item>
        </div>

        <Form.Item
          label="Category"
          name="category"
          rules={[{ required: true, message: "Please select category" }]}
        >
          <Select
            placeholder="Select team category"
            options={categoryOptions}
          />
        </Form.Item>

        <Form.Item
          label="Bio"
          name="bio"
          rules={[{ required: true, message: "Please enter bio" }]}
        >
          <Input.TextArea
            rows={4}
            placeholder="Enter team member bio/description"
          />
        </Form.Item>

        <Form.Item
          name="photo"
          label="Profile Photo"
          tooltip={`Required dimensions: 600 x 600\nAccepted formats: JPG, PNG, JPEG, GIF`}
          rules={[{ required: true, message: "Please upload profile photo" }]}
        >
          <UploadImage form={form} fieldPath="photo" />
        </Form.Item>

        {/* Social Links */}

        <Form.Item
          label="Facebook"
          name={["socials_links", "facebook"]}
          rules={[{ type: "url", message: "Enter a valid URL" }]}
        >
          <Input placeholder="Facebook URL" />
        </Form.Item>
        <Form.Item
          label="Instagram"
          name={["socials_links", "instagram"]}
          rules={[{ type: "url", message: "Enter a valid URL" }]}
        >
          <Input placeholder="Instagram URL" />
        </Form.Item>
        <Form.Item
          label="Twitter"
          name={["socials_links", "twitter"]}
          rules={[{ type: "url", message: "Enter a valid URL" }]}
        >
          <Input placeholder="Twitter URL" />
        </Form.Item>
        <Form.Item
          label="LinkedIn"
          name={["socials_links", "linkedin"]}
          rules={[{ type: "url", message: "Enter a valid URL" }]}
        >
          <Input placeholder="LinkedIn URL" />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            onClick={() => form.submit()}
            loading={isLoading}
            size="large"
            className="w-full"
          >
            Add Team Member
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateOurTeamModal;
