import React from "react";
import Lottie from "react-lottie";

function AnimationFunction({ animationData, height = "100vh", width = "100%" }) {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData,
    renderer: "svg",
  };

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
        height: "100vh", // Set to full viewport height
        overflow: "hidden", // Prevent any scrollbars
      }}
    >
      <Lottie options={defaultOptions} height={height} width={width} />
    </div>
  );
}

export default AnimationFunction;
