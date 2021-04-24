import { useEffect } from 'react'
import { useState } from "react";
import axios from "axios";
import * as tf from '@tensorflow/tfjs'

import huda from './assets/img/huda-24.jpg'

function App() {
  const [imageSelected, setImageSelected] = useState("");
  const [imageUploaded, setImageUploaded] = useState("");
  const [cvs, setCvs] = useState({
    width: 100,
    height: 100
  });

  const [model, setModel] = useState(null);
  const [labels, setLabels] = useState(['Defi',
  'Everet',
  'Farhan',
  'Huda',
  'Ilham',
  'Jennie',
  'Mayang',
  'Nadila',
  'Raihan',
  'Silmi']);
  const [predictLabel, setPredictLabel] = useState("");
  const [accPercent, setAccPercent] = useState("");

  console.log("hasil upload", imageSelected);
  console.log(model);

  useEffect(() => {
    async function loadModel() {
      // const modelJson = await require("./assets/model/model.json")
      // const modelWeigth = await require("./assets/model/group1-shard.bin")
  
      // const result = await tf.loadLayersModel(modelJson)

      const result = await tf.loadLayersModel(
        "https://raw.githubusercontent.com/auzanassdq/tfjsmodel/main/model.json", 
        // "https://raw.githubusercontent.com/ohyicong/masksdetection/master/model/model.json",
        // "https://github.com/auzanassdq/tfjsmodel/blob/main/group1-shard.bin"
        (modelWeight) => {
          console.log(modelWeight);
        }
      )
      setModel(result)

    }
    loadModel()

  }, []);

  const uploadImage = () => {
    const formData = new FormData();
    formData.append("image", imageSelected);
    // formData.append("upload_preset", "gfydmil3");
    formData.append("key", "35969ba19d2f852cb766c675ee5cdc58");
    // axios
    //   .post("https://api.imgbb.com/1/upload", formData)
    //   .then((response) => );

    setImageUploaded(imageSelected.name)
  };

  const imageHandler = (e) => {
    // const reader = new FileReader()
    // reader.onload = () => {
    //   if (reader.readyState == 2) {
    //     setImageUploaded(reader.result)
    //     const image = tf.browser.fromPixels(imageUploaded)
    //     console.log("HALLOOO", image);
    //     console.log(model.predict(image))
    //   }
    // }
    // reader.readAsDataURL(e.target.files[0])

    const ctx = document.getElementById("cvs").getContext('2d');
    const img = new Image();

    img.onload = () => {
      const width = img.width;
      const height = img.height;

      setCvs({ width:244, height:244 });

      ctx.drawImage(img, 0, 0, 244, 244);

      URL.revokeObjectURL(img.src);

      /* Read pixel data */
      const imageData = ctx.getImageData(0, 0, 244, 244);
      console.log("HALLOOO", imageData);
      // const data = imageData.data;
      // console.log("HALLOOO", data);

      // => [r,g,b,a,...]

      const image = tf.browser.fromPixels(imageData)
      console.log("HALLOOO", image);
      console.log("HALLOOO", image.shape/255.0);

      // console.log(model.predict(image.reshape([null, ...image.shape])))

      // const pixels = [];
      // for (let i = 0; i < data.length; i += 4) {
      //   pixels.push('#' + rgbToHex(
      //     data[i],
      //     data[i + 1],
      //     data[i + 2]
      //     // data[i+3] == alpha
      //   ))
      // }
      // console.log(`pixels (${img.width}x${img.height})`, pixels);
    };
    img.src = URL.createObjectURL(e.target.files[0]);
  }

  function rgbToHex(r, g, b) {
    if (r > 255 || g > 255 || b > 255)
      throw "Invalid color component";
    return ((r << 16) | (g << 8) | b).toString(16);
  }

  const predictImage = async () => {
    const img = document.getElementById("face-image")
    let image = tf.browser.fromPixels(img).resizeNearestNeighbor([224,224]).toFloat()

    console.log("IMAGE", image);
    console.log("IMAGE", image.dataSync());

    let offset=tf.scalar(127.5);
    image = image.sub(offset).div(offset).expandDims()
    console.log(image);

    const resizeImage = tf.reshape(image, [1, 224, 224, 3],'resize');
    console.log(resizeImage);

    let prediction = model.predict(resizeImage)
    let predictClass = prediction.argMax(1).dataSync();

    console.log(prediction.dataSync());
    console.log(prediction.dataSync()[predictClass] * 100);
    console.log(predictClass);
    setAccPercent(`${(prediction.dataSync()[predictClass] * 100).toFixed(2)}%`)
    setPredictLabel(labels[predictClass])
  }

  return (
    <div>
      <img id="face-image" src={huda} width={224} height={224} />
      <button onClick={predictImage}>Predict Image</button>
      <h1>{predictLabel}</h1>
      <h1>{accPercent}</h1>

      {/* <div>
        <h1>Image upload</h1>
      </div>
      <div>
        <input
          type="file"
          onChange={imageHandler}
        />
        <button onClick={uploadImage}>Upload Image</button>
      </div> */}
      {/* {imageUploaded === "" ? null : <img src={imageUploaded} alt="zoom" />} */}
      {/* <canvas
        width={cvs.width}
        height={cvs.height}
        id="cvs" /> */}
    </div>
  );
}

export default App;
