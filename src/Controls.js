import {
  VideocamOutlined,
  VideocamOffOutlined,
  MicNoneOutlined,
  MicOffOutlined,
  LogoutOutlined,
  PodcastsOutlined,
  StopCircleOutlined,
} from "@mui/icons-material";
import { IconButton, Button } from "@mui/material";
import {
  selectHLSState,
  useHMSActions,
  useHMSStore,
} from "@100mslive/react-sdk";
import {
  selectIsLocalAudioEnabled,
  selectIsLocalVideoEnabled,
  selectLocalPeer,
} from "@100mslive/react-sdk";

function Controls() {
  const audioEnabled = useHMSStore(selectIsLocalAudioEnabled);
  const videoEnabled = useHMSStore(selectIsLocalVideoEnabled);
  const localPeer = useHMSStore(selectLocalPeer);
  const hmsActions = useHMSActions();
  const hlsState = useHMSStore(selectHLSState);

  const toggleAudio = async () => {
    await hmsActions.setLocalAudioEnabled(!audioEnabled);
  };

  const toggleVideo = async () => {
    await hmsActions.setLocalVideoEnabled(!videoEnabled);
  };
  const startHLSStreaming = async () => {
    try {
      await hmsActions.startHLSStreaming();
    } catch (err) {
      alert(`failed to start hls ${err}`);
    }
  };

  const stopHLSStreaming = async () => {
    try {
      await hmsActions.stopHLSStreaming();
    } catch (err) {
      alert(`failed to stop hls ${err}`);
    }
  };
  const leaveRoom = async () => {
    if (localPeer.roleName === "broadcaster") {
      hmsActions.leave();
      await hmsActions.stopHLSStreaming();
    } else {
      hmsActions.leave();
    }
  };
  return (
    <div className="controls">
      {localPeer.roleName === "broadcaster" ? (
        <>
          <IconButton onClick={toggleAudio}>
            {audioEnabled ? <MicNoneOutlined /> : <MicOffOutlined />}
          </IconButton>
          <IconButton onClick={toggleVideo}>
            {videoEnabled ? <VideocamOutlined /> : <VideocamOffOutlined />}
          </IconButton>
          <Button
            variant="contained"
            disableElevation
            className="leave"
            onClick={leaveRoom}
          >
            <LogoutOutlined /> Leave Room
          </Button>
          {hlsState.running ? (
            <Button
              variant="contained"
              disableElevation
              className="leave"
              onClick={stopHLSStreaming}
            >
              <StopCircleOutlined /> Stop Streaming
            </Button>
          ) : (
            <Button
              variant="contained"
              disableElevation
              onClick={startHLSStreaming}
            >
              <PodcastsOutlined /> Go Live
            </Button>
          )}
        </>
      ) : (
        <Button
          variant="contained"
          disableElevation
          className="leave"
          onClick={leaveRoom}
        >
          <LogoutOutlined /> Leave Room
        </Button>
      )}
    </div>
  );
}

export default Controls;
