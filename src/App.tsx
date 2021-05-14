import React, { createRef, useEffect, useState } from "react";
import Webcam from "react-webcam";
import "@tensorflow/tfjs";
import * as cocoSsd from "@tensorflow-models/coco-ssd";

function App() {
  const webcamRef = createRef<Webcam>();
  const canvasRef = createRef<HTMLCanvasElement>();

  useEffect(() => {
    console.log("initial effect");
    initCoco();
  });

  const initCoco = async () => {
    console.log("detecting objects...");
    try {
      const net = await cocoSsd.load();
      return setInterval(() => {
        detect(net);
      }, 30);
    } catch (err) {
      console.error(err);
    }
  };

  const detect = async (net: cocoSsd.ObjectDetection) => {
    const node = webcamRef.current;
    if (node) {
      const video = node.video;
      if (video && video.readyState === 4) {
        drawObjects(await net.detect(video));
      }
    }
  };

  const drawObjects = (objects: Array<cocoSsd.DetectedObject>) => {
    objects.forEach((detectedObject) => {
      console.log("new object");
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        const { class: title, bbox } = detectedObject;
        if (ctx) {
          // Set canvas height and width
          canvas.width = width;
          canvas.height = height;

          ctx.beginPath();
          ctx.fillStyle = "green";
          ctx.fillText(title, bbox[0], bbox[1]);
          ctx.rect(...bbox);
          ctx.stroke();
        }
      }
    });
  };

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user",
  };

  const { width, height } = videoConstraints;

  return (
    <>
      <Webcam
        ref={webcamRef}
        audio={false}
        height={height}
        width={width}
        videoConstraints={videoConstraints}
        style={{
          position: "absolute",
          marginLeft: "auto",
          marginRight: "auto",
          left: 0,
          right: 0,
          textAlign: "center",
          zIndex: 1,
          width,
          height,
        }}
      />
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          marginLeft: "auto",
          marginRight: "auto",
          left: 0,
          right: 0,
          textAlign: "center",
          zIndex: 8,
          width,
          height,
        }}
      />
    </>
  );
}

export default App;
