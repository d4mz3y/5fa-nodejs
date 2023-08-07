import React, { useState, useEffect } from "react";

const OtpAuth = () => {
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const correctOtp = "123456";
  const maxAttempts = 3;
  const [attempts, setAttempts] = useState(0);

  const handleOtpChange = (index, value) => {
    const newOtpDigits = [...otpDigits];
    newOtpDigits[index] = value;

    if (value !== "" && index < 5) {
      newOtpDigits[index + 1] = "";
    }

    setOtpDigits(newOtpDigits);
  };

  const handlePaste = () => {
    navigator.clipboard.readText().then((clipboardText) => {
      const digits = clipboardText.match(/\d+/g);
      if (digits) {
        const firstValue = digits[0];
        const newOtpDigits = firstValue.split("").map((digit, index) => {
          return index < 6 ? digit : "";
        });
        setOtpDigits(newOtpDigits);
      }
    });
  };

  const handleKeyDown = (event, index) => {
    if (event.key >= "0" && event.key <= "9") {
      handleOtpChange(index, event.key);
    } else if (event.key === "Backspace" && index > 0) {
      handleOtpChange(index - 1, "");
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const enteredOtp = otpDigits.join("");
    if (enteredOtp === correctOtp) {
      console.log("Entered OTP is correct.");
    } else {
      setAttempts(attempts + 1);
      if (attempts < maxAttempts - 1) {
        console.log(`Entered OTP is incorrect. You have ${maxAttempts - attempts - 1} attempts left. Please retry.`);
      } else {
        console.log("You have exceeded the maximum number of attempts. Please try again later.");
        window.location.reload();
      }
    }
  };

  useEffect(() => {
    if (attempts >= maxAttempts) {
      window.location.reload();
    }
  }, [attempts]);

  return (
    <div className="otp-wrapper">
      <h1>Enter OTP</h1>
      <form onSubmit={handleSubmit}>
        <fieldset>
          {otpDigits.map((digit, index) => (
            <div key={index}>
              <label htmlFor={`digit-${index}`} className="sr-only">{`Enter Digit ${index + 1}`}</label>
              <input
                type="number"
                id={`digit-${index}`}
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                min="0"
                max="9"
              />
            </div>
          ))}
        </fieldset>
        <div className="btn-wrapper">
          <button type="button" onClick={handlePaste}>Paste</button>
          <button type="submit" disabled={attempts >= maxAttempts}>Verify</button>
        </div>
      </form>
    </div>
  );
};

export default OtpAuth;
