import { Flex } from "antd";
import type { FC } from "react";

type WordLengthSettingOptionProp = {
  value: number;
};

const WordLengthSettingOption: FC<WordLengthSettingOptionProp> = ({
  value,
}) => {
  return (
    <Flex
      className="word-length-setting-option"
      gap={20}
      aria-label={`Select word length - ${value} characters`}
    >
      <span>{`${value} characters`}</span>
      <Flex gap={5} className="tiles">
        {Array.from({ length: value }).map((_, idx) => (
          <div className="mini-tile" key={idx}></div>
        ))}
      </Flex>
    </Flex>
  );
};

export default WordLengthSettingOption;
