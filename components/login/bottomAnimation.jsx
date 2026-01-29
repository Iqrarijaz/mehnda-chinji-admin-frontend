import React, { Component } from "react";
import Lottie from "react-lottie";
import animationData from "../../assets/json/bottom.json";

class BottomAnimation extends Component {
  state = { isClient: false };

  componentDidMount() {
    this.setState({ isClient: true });
  }

  render() {
    if (!this.state.isClient) return null;
    const defaultOptions = {
      loop: true,
      autoplay: true,
      animationData: animationData,
      renderer: "svg",
    };

    return (
      <div style={{ position: "absolute", bottom: 0, left: 0 }}>
        <Lottie options={defaultOptions} height={400} />
      </div>
    );
  }
}

export default BottomAnimation;
