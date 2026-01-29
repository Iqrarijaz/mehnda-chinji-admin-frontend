import React from "react";

function AnimationFunction({ children }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      {children}
    </div>
  );
}

export default AnimationFunction;
