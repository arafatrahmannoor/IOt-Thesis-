import { Input, InputRef } from "antd";
import { useEffect, useRef, useState } from "react";

interface OtpInputProps {
  length?: number;
  value?: string;
  onChange?: (value: string) => void;
  onComplete?: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

const OtpInput = ({
  length = 4,
  value = "",
  onChange,
  onComplete,
  disabled = false,
  className = "",
}: OtpInputProps) => {
  const [otp, setOtp] = useState<string[]>(
    Array(length).fill("") as string[]
  );
  const inputRefs = useRef<(InputRef | null)[]>([]);

  useEffect(() => {
    if (value) {
      const values = value.split("").slice(0, length);
      const newOtp = [...Array(length).fill("")];
      values.forEach((val, idx) => {
        if (idx < length) {
          newOtp[idx] = val;
        }
      });
      setOtp(newOtp);
    } else {
      setOtp(Array(length).fill("") as string[]);
    }
  }, [value, length]);

  const handleChange = (index: number, val: string) => {
    if (disabled) return;

    // Only allow numbers
    if (val && !/^\d$/.test(val)) return;

    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);

    const otpValue = newOtp.join("");
    onChange?.(otpValue);

    // Auto-focus next input
    if (val && index < length - 1) {
      inputRefs.current[index + 1]?.input?.focus();
    }

    // Call onComplete when all inputs are filled
    if (otpValue.length === length) {
      onComplete?.(otpValue);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        // Focus previous input if current is empty
        inputRefs.current[index - 1]?.input?.focus();
      } else {
        // Clear current input
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
        onChange?.(newOtp.join(""));
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.input?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.input?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    if (disabled) return;

    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    const numbers = pastedData.match(/\d/g)?.join("") || "";
    
    if (numbers.length > 0) {
      const newOtp = [...Array(length).fill("")];
      const values = numbers.split("").slice(0, length);
      values.forEach((val, idx) => {
        if (idx < length) {
          newOtp[idx] = val;
        }
      });
      setOtp(newOtp);
      const otpValue = newOtp.join("");
      onChange?.(otpValue);

      // Focus last filled input or next empty input
      const nextIndex = Math.min(values.length, length - 1);
      inputRefs.current[nextIndex]?.input?.focus();

      if (otpValue.length === length) {
        onComplete?.(otpValue);
      }
    }
  };

  return (
    <div className={`flex gap-1.5 sm:gap-2 md:gap-2.5 justify-center ${className}`}>
      {otp.map((digit, index) => (
        <Input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          disabled={disabled}
          maxLength={1}
          className="w-9 h-9 sm:w-11 sm:h-11 md:w-12 md:h-12 text-center text-sm sm:text-base md:text-lg font-semibold rounded-md border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          autoComplete="off"
        />
      ))}
    </div>
  );
};

export default OtpInput;

