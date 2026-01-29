import React, { Component } from "react";
import Lottie from "react-lottie";
import animationData from "../../assets/json/loader.json";
class NotFoundAnimation extends Component {
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
      <div>
        <Lottie options={defaultOptions} height={500} width={500} />
      </div>
    );
  }
}
export default NotFoundAnimation;
