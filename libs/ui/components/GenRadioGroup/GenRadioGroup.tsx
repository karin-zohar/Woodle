import { useMemo, type CSSProperties, type FC } from "react";
import { Radio, type RadioGroupProps } from "antd";
import "./gen-radio-group.style.css";

interface IGenRadioButtonsProps extends RadioGroupProps {
  vertical?: boolean;
  gap?: number;
}

const GenRadioButtons: FC<IGenRadioButtonsProps> = ({
  vertical = false,
  gap = 4,
  ...props
}) => {
  const verticalStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: gap,
  };
  const groupStyle = useMemo(
    () => (vertical ? verticalStyle : undefined),
    [vertical]
  );

  return (
    <Radio.Group style={groupStyle} {...props} className="gen-radio-buttons" />
  );
};

export default GenRadioButtons;
