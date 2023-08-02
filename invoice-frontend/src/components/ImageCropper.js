import React, {useState} from "react";
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import demoImage from "../images/modern.png";
import axios, * as others from "axios";
import URI from "../utils/request";

export default function ImageCropper(props) {
    const {imageToCrop, onImageCropped} = props;
    
    const [croppedImagelast,setCroppedimagelast] = useState();
    const [extractedText,setExtractedtext] = useState();
    const [cropConfig, setCropConfig] = useState(
        // default crop config
        {
            unit: 'px', // default, can be 'px' or '%'
            x: 130,
            y: 50,
            width: 200,
            height: 200
        }
    );

    const [imageRef, setImageRef] = useState();


    async function cropImage(crop) {
        if (imageRef && crop.width && crop.height) {
            const croppedImage = await getCroppedImage(
                imageRef,
                crop,
                'croppedImage.jpeg' // destination filename
            );
            var res;
            // calling the props function to expose
            // croppedImage to the parent component
            // setCroppedimagelast()
            var format = {
                file_input: "",
              };  
              
            format['file_input'] = croppedImage
            
            res = await axios.post(URI + "crop", format,{
                headers: {
                  "content-Type": "application/json",
                },
              })
              .then((response) => {
               /*  console.log("res",response['data']) */
                // setExtractedtext(response['data'])
                onImageCropped(response['data']);
              });
            

        }
    }

    function getCroppedImage(sourceImage, cropConfig, fileName) {
        // creating the cropped image from the source image
        const canvas = document.createElement('canvas');
        const scaleX = sourceImage.naturalWidth / sourceImage.width;
        const scaleY = sourceImage.naturalHeight / sourceImage.height;
        canvas.width = cropConfig.width;
        canvas.height = cropConfig.height;
        const ctx = canvas.getContext('2d');

        ctx.drawImage(
            sourceImage,
            cropConfig.x * scaleX,
            cropConfig.y * scaleY,
            cropConfig.width * scaleX,
            cropConfig.height * scaleY,
            0,
            0,
            cropConfig.width,
            cropConfig.height
        );

        return canvas.toDataURL("image/png", 1);
    }

    return (
        <ReactCrop
            src={imageToCrop || demoImage}
            crop={cropConfig}
            ruleOfThirds
            onImageLoaded={(imageRef) => setImageRef(imageRef)}
            onComplete={(cropConfig) => cropImage(cropConfig)}
            onChange={(cropConfig) => setCropConfig(cropConfig)}
            crossorigin="anonymous" // to avoid CORS-related problems
        />
    );
}

ImageCropper.defaultProps = {
    onImageCropped: () => {}
}
