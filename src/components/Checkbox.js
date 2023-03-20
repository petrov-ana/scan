import { useState } from "react";

const Checkbox = ({ label, checked, onChange, ...props }) => {
  const defaultChecked = checked ? checked : false;
  const [isChecked, setIsChecked] = useState(defaultChecked);
  
  const handleChange = (e) => {
    setIsChecked(!isChecked);
    onChange(e);
  };

  return (
    <div className="checkbox-wrapper">
      <label>
        <input
          type="checkbox"
          checked={isChecked}
          onChange={(e) => handleChange(e)}
          className={isChecked ? "checked" : ""}
          {...props}
        />
        <span>{label}</span>
      </label>      
    </div>
  );
};
export default Checkbox;