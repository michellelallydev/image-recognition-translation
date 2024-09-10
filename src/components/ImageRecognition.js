import React, { useState, useRef } from 'react';
import '@tensorflow/tfjs-backend-cpu';
import '@tensorflow/tfjs-backend-webgl';
import * as cocoSsd from '@tensorflow-models/coco-ssd';

const ImageRecognition = () => {
  const [image, setImage] = useState(null); // State for uploaded image
  const [predictions, setPredictions] = useState([]); // State for predictions
  const canvasRef = useRef(null); // Reference for canvas element
  const imgRef = useRef(null); // Reference for the uploaded image

  // Function to detect contours and draw boxes around detected objects
  const detectContour = (context, predictions, img) => {
    const scaleWidth = canvasRef.current.width / img.width;
    const scaleHeight = canvasRef.current.height / img.height;

    predictions.forEach((prediction) => {
      const [x, y, width, height] = prediction.bbox;

      // Scale the bounding box to fit the canvas
      context.beginPath();
      context.rect(x * scaleWidth, y * scaleHeight, width * scaleWidth, height * scaleHeight);
      context.lineWidth = 4;
      context.strokeStyle = 'tomato';
      context.fillStyle = 'white';
      context.stroke();
      context.fillText(
        `${prediction.class} - ${prediction.score.toFixed(3)}`,
        x * scaleWidth,
        (y + 15) * scaleHeight
      );
    });
  };

  // Function to draw the image and predictions on the canvas
  const drawImage = (predictions, img) => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // Clear the canvas before drawing the image
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Set canvas width and height to match the image dimensions
    canvas.width = img.width;
    canvas.height = img.height;

    // Draw the uploaded image on the canvas
    context.drawImage(img, 0, 0, canvas.width, canvas.height);

    // Draw contours around the detected objects
    detectContour(context, predictions, img);
  };

  // Handle file upload and process the image
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = async () => {
      imgRef.current = img; // Store the image reference

      // Load the COCO-SSD model
      const model = await cocoSsd.load();

      // Detect objects in the uploaded image
      const predictions = await model.detect(img);

      // Set predictions in state and draw image
      setPredictions(predictions);
      drawImage(predictions, img);
    };
  };

  return (
    <div>
      {/* Input for uploading image */}
      <input type="file" accept="image/*" onChange={handleFileUpload}/>

      {/* Canvas for drawing image and predictions */}
      <div>
        <canvas
          ref={canvasRef}
          style={{ maxWidth: '600px', maxHeight: '600px', marginTop: '20px', marginLeft: 'auto', marginRight: 'auto'}}
        ></canvas>
      </div>
    </div>
  );
};

export default ImageRecognition;
