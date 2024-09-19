import React, { useState, useRef } from 'react';
import '@tensorflow/tfjs-backend-cpu';
import '@tensorflow/tfjs-backend-webgl';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import { useTranslation } from 'react-i18next';

const ImageRecognition = () => {
    const { t, i18n } = useTranslation(); // Access the translation functions
    const [predictions, setPredictions] = useState([]);
    const canvasRef = useRef(null);
    const imgRef = useRef(null);

    // Function to detect contours and draw boxes around detected objects
    const detectContour = (context, predictions, img, offsetX, offsetY) => {
        const scaleWidth = canvasRef.current.width / img.width;
        const scaleHeight = canvasRef.current.height / img.height;

        predictions.forEach((prediction) => {
            const [x, y, width, height] = prediction.bbox;

            // Scale the bounding box to fit the canvas and add offset
            context.beginPath();
            context.rect(offsetX + x, offsetY + y, width, height);
            context.lineWidth = 4;
            context.strokeStyle = 'tomato';
            context.fillStyle = 'white';
            context.stroke();

            // Translate the object class using i18next
            const translatedClass = t(prediction.class.replace(/\s+/g, '_'));
            console.log(translatedClass);

            // Draw the translated class name on the canvas
            context.fillText(
                `${translatedClass} - ${prediction.score.toFixed(3)}`,
                offsetX + x,
                offsetY + (y + 10) 
            );
        });
    };

    // Function to draw the image centered in the canvas
    const drawImage = (predictions, img) => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        // Clear the canvas before drawing the image
        context.clearRect(0, 0, canvas.width, canvas.height);

        // Calculate offsets to center the image
        const offsetX = (canvas.width - img.width) / 2;
        const offsetY = (canvas.height - img.height) / 2;

        // Draw the image centered in the canvas
        context.drawImage(img, offsetX, offsetY, img.width, img.height);

        // Draw contours around the detected objects
        detectContour(context, predictions, img, offsetX, offsetY);
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
            {/* Language Switcher */}
            <div>
                <button onClick={() => i18n.changeLanguage('en')} class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l">English</button>
                <button onClick={() => i18n.changeLanguage('es')} class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r">Gaeilge</button>
                {/* Add more language buttons as needed */}
            </div>
            {/* Input for uploading image */}

            {/* <input class="block text-sm text-gray-200 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" id="file_input" type="file" accept="image/*" onChange={handleFileUpload}/> */}
            <br></br>
            <input type="file" accept="image/*" onChange={handleFileUpload}  class="bg-orange-500 hover:bg-tomato-700 text-white font-bold py-2 px-4 border border-tomato-700 rounded" />
            
            {/* Canvas for drawing image and predictions */}
            <div>
                <canvas
                    ref={canvasRef}
                    width="600"
                    height="600"
                    style={{ marginLeft: 'auto', marginRight: 'auto' , marginTop: '-50px'}}
                ></canvas>
            </div>
        </div>
    );
};

export default ImageRecognition;
