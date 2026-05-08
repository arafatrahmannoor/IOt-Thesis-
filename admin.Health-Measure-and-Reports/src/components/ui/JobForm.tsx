import { Button, Card, Form, Input, Select, Space } from "antd";
import { FormInput } from "../../components/form/FormInput";
import { FormSelect } from "../../components/form/FormSelect";
import { FormTextarea } from "../../components/form/FormTextarea";
// import FormDatePicker from "../../components/form/FormDatePicker";
import { CloseCircleOutlined, PlusOutlined } from "@ant-design/icons";

interface JobFormProps {
  mode: "create" | "edit";
  job?: any;
}

const JobForm: any = ({ mode, job }: any) => {
  const [form] = Form.useForm();

  const handleSubmit = (values: any) => {
    if (mode === "create") {
      console.log("Create job:", values);
    } else {
      console.log("Update job:", { ...job, ...values });
    }
  };
  return (
    <Card bordered={false} className="w-full rounded-xl shadow-md p-6">
      <h2 className="text-lg font-semibold mb-4">
        {mode === "edit" ? "Edit Job" : "Create New Job"}
      </h2>

      <Form
        form={form}
        layout="vertical"
        initialValues={job || {}}
        onFinish={handleSubmit}
      >
        {/* Job Details */}
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            name="title"
            label="Job Title"
            placeholder="e.g., Project Manager"
            rules={[{ required: true, message: "Please enter job title" }]}
          />
          <FormSelect
            name="employment_type"
            label="Employment Type"
            options={[
              { label: "Full Time", value: "Full Time" },
              { label: "Part Time", value: "Part Time" },
              { label: "Contract", value: "Contract" },
            ]}
            placeholder="Select type"
            rules={[{ required: true, message: "Select employment type" }]}
          />
        </div>

        {/* Location */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <Form.Item name={["location", "city"]} label="City">
            <Input placeholder="e.g., Berlin" />
          </Form.Item>
          <Form.Item name={["location", "country"]} label="Country">
            <Input placeholder="e.g., France" />
          </Form.Item>
        </div>

        {/* Salary */}
        <div className="grid grid-cols-4 gap-4 mt-4">
          <Form.Item name={["salary", "min"]} label="Min Salary">
            <Input placeholder="1300" />
          </Form.Item>
          <Form.Item name={["salary", "max"]} label="Max Salary">
            <Input placeholder="1500" />
          </Form.Item>
          <Form.Item name={["salary", "currency"]} label="Currency">
            <Input placeholder="£" />
          </Form.Item>
          <Form.Item name={["salary", "period"]} label="Period">
            <Select
              options={[
                { label: "Monthly", value: "monthly" },
                { label: "Yearly", value: "yearly" },
              ]}
              placeholder="Select"
            />
          </Form.Item>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          {/* <FormDatePicker
            name="expiration_date"
            label="Expiration Date"
            placeholder="Select expiration date"
          /> */}
          <FormInput
            name="experience_required"
            label="Experience Required"
            placeholder="e.g., 0-3 years"
            className="mt-4"
          />
        </div>

        {/* Support */}

        <h3 className="text-[14px] mb-3">Support</h3>
        <Form.List name="support">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space
                  key={key}
                  style={{ display: "flex", marginBottom: 8 }}
                  align="baseline"
                  wrap
                >
                  <Form.Item
                    {...restField}
                    name={name} // <-- direct string mapping
                    rules={[
                      {
                        required: true,
                        message: "Please enter a support",
                      },
                    ]}
                    style={{ flex: 1 }}
                  >
                    <Input placeholder="e.g.,Visa Support" />
                  </Form.Item>

                  <CloseCircleOutlined onClick={() => remove(name)} />
                </Space>
              ))}

              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  Add Support
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        {/* Description */}
        <FormTextarea
          name="description"
          label="Job Description"
          placeholder="Describe the role..."
          rows={4}
          className="mt-4"
        />

        {/* Responsibilities */}

        <h3 className="text-[14px] mb-3">Responsibilities</h3>
        <Form.List name="responsibilities">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space
                  key={key}
                  style={{ display: "flex", marginBottom: 8 }}
                  align="baseline"
                  wrap
                >
                  <Form.Item
                    {...restField}
                    name={name} // <-- direct string mapping
                    rules={[
                      {
                        required: true,
                        message: "Please enter a responsibilities",
                      },
                    ]}
                    style={{ flex: 1 }}
                  >
                    <Input placeholder="List responsibilities" />
                  </Form.Item>

                  <CloseCircleOutlined onClick={() => remove(name)} />
                </Space>
              ))}

              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  Add Responsibilities
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        {/* Qualifications */}

        <h3 className="text-[14px] mb-3">Qualifications</h3>
        <Form.List name="qualifications">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space
                  key={key}
                  style={{ display: "flex", marginBottom: 8 }}
                  align="baseline"
                  wrap
                >
                  <Form.Item
                    {...restField}
                    name={name} // <-- direct string mapping
                    rules={[
                      {
                        required: true,
                        message: "Please enter a qualification",
                      },
                    ]}
                    style={{ flex: 1 }}
                  >
                    <Input placeholder="e.g., Bachelor's degree" />
                  </Form.Item>

                  <CloseCircleOutlined onClick={() => remove(name)} />
                </Space>
              ))}

              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  Add Qualification
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        {/* Flag */}
        <FormInput
          name="country_flag"
          label="Country Flag URL"
          placeholder="Enter url"
          className="mt-4"
        />
        {/* job image */}
        <FormInput
          name="image"
          label="Job image"
          placeholder="Enter url"
          className="mt-4"
        />
        {/* Submit */}
        <div className="text-right mt-6">
          <Button type="primary" htmlType="submit" size="large">
            {mode === "edit" ? "Save Changes" : "Create Job"}
          </Button>
        </div>
      </Form>
    </Card>
  );
};

export default JobForm;
