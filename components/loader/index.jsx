import React, { memo } from "react";
import { Spin } from "antd";

const Loader = memo(function Loader({ size = "large", tip }) {
  return (
    <div className="flex items-center justify-center p-8 text-teal-600 dark:text-teal-400">
      <Spin size={size} tip={tip} />
    </div>
  );
});

Loader.displayName = "Loader";

export default Loader;
