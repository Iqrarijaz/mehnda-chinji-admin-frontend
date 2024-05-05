import React, { Component } from "react";
import Lottie from "react-lottie";
import animationData from "../../assets/json/top.json";

class TopAnimation extends Component {
  render() {
    const defaultOptions = {
      loop: true,
      autoplay: true,
      animationData: animationData,
      renderer: "svg",
    };

    return (
      <div style={{ position: "absolute", top: 0, right: 0 }}>
        <Lottie options={defaultOptions} height={400}  />
      </div>
    );
  }
}

export default TopAnimation;
