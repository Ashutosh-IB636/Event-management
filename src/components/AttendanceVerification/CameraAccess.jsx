import React, { useEffect, useRef, useState } from "react";
import Button from "../Button";
import { useDispatch } from "react-redux";

function CameraAccess({ onAttend }) {
  const [location, setLocation] = useState();
  const [photoTaken, setPhotoTaken] = useState(false);
  const [photoData, setPhotoData] = useState(null);
  const dispatch = useDispatch();

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const photoRef = useRef(null);

  const width = 400; // Increased width
  const [height, setHeight] = useState(0);
  const [streaming, setStreaming] = useState(false);

  useEffect(() => {
    if (!photoTaken) {
      startCamera();
    }
    requestLocationAccess();
    // eslint-disable-next-line
  }, [photoTaken]);

  const startCamera = () => {
    const video = videoRef.current;
    if (navigator.mediaDevices && video) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: false })
        .then((stream) => {
          video.srcObject = stream;
          video.play();
        })
        .catch((err) => {
          console.error(`An error occurred: ${err}`);
        });
    }
  };

  const stopCamera = () => {
    const video = videoRef.current;
    if (video && video.srcObject) {
      const stream = video.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
      video.srcObject = null;
    }
  };

  const requestLocationAccess = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation(position);
        },
        () => {
          alert("Location access is required to verify attendance.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  function takePicture() {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext("2d");
    if (width && height) {
      canvas.width = width;
      canvas.height = height;
      context.drawImage(video, 0, 0, width, height);

      const data = canvas.toDataURL("image/png");
      setPhotoData(data);
      setPhotoTaken(true);
      stopCamera();
    }
  }

  function handleCanPlay() {
    const video = videoRef.current;
    if (!streaming) {
      let calculatedHeight = video.videoHeight / (video.videoWidth / width);
      if (isNaN(calculatedHeight)) {
        calculatedHeight = 300; // Increased default height
      }
      setHeight(calculatedHeight);
      video.setAttribute("width", width);
      video.setAttribute("height", calculatedHeight);
      setStreaming(true);
    }
  }

  function handleCapture(e) {
    e.preventDefault();
    takePicture();
  }

  function handleAttendEvent() {
    // Capture the current time
    const timestamp = new Date().toLocaleString();
    // Pass photo, location, and time to parent
    onAttend(photoData, location, timestamp);
    alert(
      `Attendance marked!\nLocation: ${location?.coords?.latitude}, ${location?.coords?.longitude}\nPhoto captured.\nTime: ${timestamp}`
    );
    // You can send photoData, location, and timestamp to your backend or Redux here if needed
  }

  function handleRetake() {
    setPhotoTaken(false);
    setPhotoData(null);
    setStreaming(false);
    // Camera will restart due to useEffect
  }

  return (
    <div
      className="flex flex-col items-center justify-center bg-white p-4"
      style={{ maxWidth: 450 }}
    >
      {!photoTaken && (
        <>
          <video
            ref={videoRef}
            onCanPlay={handleCanPlay}
            id="video"
            className="border rounded mb-2"
            autoPlay
            playsInline
            style={{ width: width, height: height || 300 }}
          ></video>
          <Button
            title={"Take Photo"}
            click={handleCapture}
            color={"bg-third"}
          />
        </>
      )}
      <canvas ref={canvasRef} id="canvas" style={{ display: "none" }}></canvas>
      {photoTaken && (
        <div className="output flex flex-col items-center mt-2">
          <img
            ref={photoRef}
            id="photo"
            src={photoData}
            alt="The screen capture will appear in this box."
            className="border rounded mb-2"
            style={{ width: width, height: height || 300 }}
          />
          <div className="flex gap-2">
            <Button
              title={"Confirm Attendance"}
              click={handleAttendEvent}
              color={"bg-fourth"}
            />
            <Button title={"Retake"} click={handleRetake} color={"bg-third"} />
          </div>
        </div>
      )}
    </div>
  );
}

export default CameraAccess;
