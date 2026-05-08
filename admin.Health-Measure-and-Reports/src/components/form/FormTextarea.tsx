import { Form } from "antd";
import { Rule } from "antd/es/form";
import { TextAreaProps } from "antd/es/input";
import TextArea from "antd/es/input/TextArea";
import InputError from "./InputError";

interface FormTextareaProps extends TextAreaProps {
  name: string;
  size?: "large" | "small" | "middle";
  label?: string;
  rules?: Rule[];
  placeholder?: string;
  fieldError?: Record<string, string>;
  setFieldError?: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

export const FormTextarea = ({
  name,
  label,
  rules,
  size = "large",
  placeholder,
  fieldError = {},
  setFieldError = () => {},
  ...rest
}: FormTextareaProps) => {
  return (
    <Form.Item name={name} label={label} rules={rules}>
      <TextArea
        size={size}
        placeholder={placeholder}
        onChange={() => setFieldError?.((prev) => ({ ...prev, [name]: "" }))}
        {...rest}
      />
      {fieldError?.[name] ? <InputError>{fieldError[name]}</InputError> : null}
    </Form.Item>
  );
};
