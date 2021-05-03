import { createContext, useEffect } from 'react'
import { useState } from "react";
import axios from "axios";
import * as tf from '@tensorflow/tfjs'
import * as blazeface from '@tensorflow-models/blazeface'

// import huda from './assets/img/huda-24.jpg'
import huda from './assets/img/huda-25.jpg'

function FaceScanner() {
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

  const imageHandler = (e) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (reader.readyState == 2) {
        setImageUploaded(reader.result)
      }
    }
    reader.readAsDataURL(e.target.files[0])

    const ctx = document.getElementById("cvs").getContext('2d');
    const img = new Image();

    img.onload = () => {
      setCvs({ width: 244, height: 244 });

      ctx.drawImage(img, 0, 0, 244, 244);

      URL.revokeObjectURL(img.src);

      /* Read pixel data */
      const imageData = ctx.getImageData(0, 0, 244, 244);
      console.log("HALLOOO", imageData);
      const data = imageData.data;
      // console.log("HALLOOO", data);

      const pixels = [];
      for (let i = 0; i < data.length; i += 4) {
        pixels.push('#' + rgbToHex(
          data[i],
          data[i + 1],
          data[i + 2]
          // data[i+3] == alpha
        ))
      }
      console.log(`pixels (${img.width}x${img.height})`, pixels);
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
    let image = tf.browser.fromPixels(img).resizeNearestNeighbor([224, 224]).toFloat()
    console.log("IMAGE", image);
    console.log("IMAGE", image.dataSync());

    // blazeface
    // const ctx = document.getElementById("canvas").getContext('2d');
    // const blazeModel = await blazeface.load();
    // const blazePredict = await blazeModel.estimateFaces(image, false);
    // console.log(blazePredict)

    // ctx.drawImage(img, 0, 0, 224, 224)

    // blazePredict.forEach(async (item) => {
    //   ctx.beginPath()
    //   ctx.lineWidth = "4"
    //   ctx.strokeStyle = "blue"
    //   ctx.rect(
    //     item.topLeft[0],
    //     item.topLeft[1],
    //     item.bottomRight[0] - item.topLeft[0],
    //     item.bottomRight[1] - item.topLeft[1]
    //   )
    //   ctx.stroke()

    //   console.log(item.topLeft[0]);
    //   console.log(item.topLeft[1]);
    //   console.log(item.bottomRight[0] - item.topLeft[0]);
    //   console.log(item.bottomRight[1] - item.topLeft[1]);

    //   let width = parseInt((item.bottomRight[1] - item.topLeft[1]))
    //   let height = parseInt((item.bottomRight[0] - item.topLeft[0]))
    //   let faceTensor = image.slice([parseInt(item.topLeft[1]),parseInt(item.topLeft[0]),0],[width,height,3])
    //   faceTensor = faceTensor.resizeBilinear([224,224]).reshape([1,224,224,3])
    //   console.log(faceTensor);
    //   let result = await model.predict(faceTensor)
    //   let predictClass = result.argMax(1).dataSync();

    //   console.log(predictClass)
    // })

    let offset = tf.scalar(127.5);
    image = image.sub(offset).div(offset).expandDims()
    console.log(image);

    const resizeImage = tf.reshape(image, [1, 224, 224, 3], 'resize');
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
      <canvas id="canvas" src={huda} width={224} height={224}></canvas>
      <img id="face-image" src={huda} width={224} height={224} />
      <button onClick={predictImage}>Predict Image</button>
      <h1>{predictLabel}</h1>
      <h1>{accPercent}</h1>

      {/* <h1>Image upload</h1>
      <div>
        <input
          type="file"
          onChange={imageHandler}
        />
      </div>
      <canvas
        width={cvs.width}
        height={cvs.height}
        id="cvs" /> */}
    </div>
  );
}

export default FaceScanner;
