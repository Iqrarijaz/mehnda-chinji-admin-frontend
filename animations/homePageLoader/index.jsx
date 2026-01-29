import { Component } from "react";
import animationData from "../../assets/json/loading.json";
import Lottie from "react-lottie";

class Loading extends Component {
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
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "absolute",
          top: 0,
          border: "none",
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "#ffffff7d",
          zIndex: 999,
          borderRadius: "10px",
        }}
      >
        <Lottie options={defaultOptions} height={100} width={100} />
      </div>
    );
  }
}
export default Loading;
