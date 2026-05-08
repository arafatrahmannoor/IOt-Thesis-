import { Button, Form, Input, Modal, Select } from "antd";
import React, { useEffect } from "react";
import { toast } from "react-toastify";
import { useUpdateOurTeamMutation } from "../../redux/features/ourTeam/ourTeamApi";
import UploadImage from "../shared/UploadImage";

interface UpdateOurTeamModalProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  data: any;
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

const UpdateOurTeamModal: React.FC<UpdateOurTeamModalProps> = ({
  open,
  setOpen,
  data,
}) => {
  const [form] = Form.useForm<any>();
  const [updateTeamMember, { isLoading }] = useUpdateOurTeamMutation();

  // Pre-fill form with selected team member data
  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        name: data.name,
        email: data.email,
        phone: data.phone,
        position: data.position,
        category: data.category,
        bio: data.bio,
        photo: data.photo,
        socials_links: data.socials_links || {},
      });
    }
  }, [data, form]);

  const handleSubmit = async (values: any) => {
    try {
      const payload = {
        id: (data as any)._id, // your API might expect _id
        data: { ...values },
      };
      const res = await updateTeamMember(payload).unwrap();
      if (res.success) {
        toast.success("Team member updated successfully!");
        setOpen(false);
        form.resetFields();
      }
    } catch (error: any) {
      // Handle backend validation errors
      if (error?.data?.err?.issues && Array.isArray(error.data.err.issues)) {
        const fieldsErrors = error.data.err.issues.map((err: any) => ({
          name: err.path.slice(1), // remove "body" from path
          errors: [err.message],
        }));
        form.setFields(fieldsErrors);
      } else {
        toast.error(error?.data?.message || "Failed to update team member");
      }
    }
  };

  return (
    <Modal
      title="Update Team Member"
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
            rules={[
              { required: true, message: "Please enter name" },
              { max: 50, message: "Name cannot exceed 50 characters" },
            ]}
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
            rules={[
              { required: true, message: "Please enter phone number" },
              { max: 20, message: "Phone number cannot exceed 20 characters" },
            ]}
          >
            <Input placeholder="Enter phone number" />
          </Form.Item>

          <Form.Item
            label="Position"
            name="position"
            rules={[
              { required: true, message: "Please enter position" },
              { max: 50, message: "Position cannot exceed 50 characters" },
            ]}
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
          rules={[
            { required: true, message: "Please enter bio" },
            { max: 500, message: "Bio cannot exceed 500 characters" },
          ]}
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
            Update Team Member
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateOurTeamModal;
