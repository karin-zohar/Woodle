import { Flex } from "antd";
import clsx from "clsx";
import type { FC } from "react";

type ExampleTileRowProps = {
  guess: string;
  statuses: string[];
};

const ExampleTileRow: FC<ExampleTileRowProps> = ({ guess, statuses }) => {
  return (
    <Flex className="example-tile-row" gap={5}>
      {guess.split("").map((char, idx) => (
        <div className={clsx("tile", statuses[idx])} key={idx}>
          {char}
        </div>
      ))}
    </Flex>
  );
};

export default ExampleTileRow;
