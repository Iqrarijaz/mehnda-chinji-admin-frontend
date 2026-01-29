import { Spin } from "antd";

const Loading = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(255, 255, 255, 0.5)",
        zIndex: 999,
        borderRadius: "10px",
      }}
    >
      <Spin size="large" />
    </div>
  );
};

export default Loading;
