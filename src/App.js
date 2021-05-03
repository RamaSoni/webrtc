import React, { Component } from "react";

class App extends Component {
  constructor(props) {
    super(props);

    this.localVideoref = React.createRef();
    this.localVideoref = React.createRef();
  }

  componentDidMount() {
    const pc_config = null;

    this.pc = new RTCPeerConnection(pc_config);
    this.pc.onicecandidate = (e) => {
      if (e.candidate) console.log(JSON.stringify(e.candidate));
    };

    this.pc.oniceconnectionstatechange = (e) => {
      console.log(e);
    };

    this.pc.onaddstream = (e) => {
      this.remoteVideoref.current.srcObject = e.stream;
    };

    const constraints = { video: true };
    const success = (stream) => {
      window.localstream = stream;
      this.localVideoref.current.srcObject = stream;
      this.pc.addStream(stream);
    };
    const failure = (e) => {
      console.log("getUserMedia Error:", e);
    };
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(success)
      .catch(failure);
  }

  createOffer = () => {
    console.log("Offer");
    this.pc.createOffer({ offerToReceiveAudio: 1 }).then(
      (sdp) => {
        console.log(JSON.stringify(sdp));
        this.pc.setLocalDescription(sdp);
      },
      (e) => {}
    );
  };

  setRemoteDescription = () => {
    const desc = JSON.parse(this.textref.value);
    this.pc.setRemoteDescription(new RTCSessionDescription(desc));
  };

  createAnswer = () => {
    console.log("Answer");
    this.pc.createAnswer({ offerToReceiveAudio: 1 }).then(
      (sdp) => {
        console.log(JSON.stringify(sdp));
        this.pc.setLocalDescription(sdp);
      },
      (e) => {}
    );
  };

  addCandidate = () => {
    const candidate = JSON.parse(this.textref.value);
    console.log("Adding candidate:", candidate);
    this.pc.addIceCandidate(new RTCIceCandidate(candidate));
  };
  render() {
    return (
      <div>
        <video
          style={{
            width: 240,
            height: 240,
            margin: 5,
            background_color: "black",
          }}
          ref={this.localVideoref}
          autoPlay
        ></video>
        <video
          style={{
            width: 240,
            height: 240,
            margin: 5,
            background_color: "black",
          }}
          ref={this.remoteVideoref}
          autoPlay
        ></video>
        <button onClick={this.createOffer}>Offer</button>
        <button onClick={this.createAnswer}>Offer</button>
        <br />
        <textarea
          ref={(ref) => {
            this.textref = ref;
          }}
        />
        <button onClick={this.setremoteDescription}>
          Set Remote Descriptions
        </button>
        <button onClick={this.addCandidate}>Add Candidate</button>
      </div>
    );
  }
}




export default App;
