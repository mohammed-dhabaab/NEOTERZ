import React, { useRef, useState, useEffect, useCallback } from 'react';
import { fabric } from 'fabric';
import styles from '../../styles';

import ColorPicker from './ColorPicker';

import fitShape from './utils/fitShape';

import { Tooltip } from '@mui/material';
import { FaUndoAlt, FaRedoAlt } from "react-icons/fa";
import { IoSave } from "react-icons/io5";
import { AiOutlineAppstoreAdd } from "react-icons/ai";
import { GiProcessor } from "react-icons/gi";
import DisplayProcessedVideo from './DisplayProcessedVideo';

import axios from 'axios';

const rgbToHexa = (rgbColor) => {
  const [r, g, b] = rgbColor.match(/\d+/g);
  return '#' + ((1 << 24) | (+r << 16) | (+g << 8) | +b).toString(16).slice(1);
}

const VisitorsCounter = ({ selectedFrame, programType, videoFile }) => {
  const [parentWidth, setParentWidth] = useState(0);
  const parentRef = useRef(null);

  const [canvas, setCanvas] = useState(null);
  const [shapesCount, setShapesCount] = useState(0);
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  const [selectedShape, setSelectedShape] = useState('enter');
  const [selectedShapeColor, setSelectedShapeColor] = useState('#000000');
  const [polygons, setPolygons] = useState([]);

  const [processedVideo, setProcessedVideo] = useState();



  useEffect(() => {
    const handleResize = () => {
      if (parentRef.current) {
        const width = parentRef.current.offsetWidth;
        setParentWidth(width);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const parentHeight = parentWidth / 2.04;

  const canvasRef = useRef(null);

  useEffect(() => {
    const newCanvas = new fabric.Canvas(canvasRef.current);
    newCanvas.setWidth(parentWidth);
    newCanvas.setHeight(parentHeight);

    setCanvas(newCanvas);
  }, [parentWidth, parentHeight]);

  const addShape = () => {
    if (!canvas || shapesCount >= 2) return;

    const initialPoints = [
      { x: 0, y: 0 },
      { x: 100, y: 0 },
      { x: 100, y: 100 },
      { x: 0, y: 100 }
    ];

    const rect = new fabric.Polygon(initialPoints, {
      left: 50,
      top: 50,
      width: 100,
      height: 100,
      fill: 'transparent',
      stroke: selectedShapeColor,
      strokeWidth: 2,
    });

    const text = new fabric.Text(shapesCount === 0 ? 'Enter' : 'Exit', {
      left: rect.left + rect.width / 2,
      top: rect.top + rect.height / 2,
      fontSize: 20,
      fill: selectedShapeColor,
      originX: 'center',
      originY: 'center',
    });

    const group = new fabric.Group([rect, text]);

    canvas.add(group);
    setShapesCount(prevCount => prevCount + 1);
    setUndoStack(prevStack => [...prevStack, group]);

    if (shapesCount === 0) {
      setSelectedShape('enter');
    } else {
      setSelectedShape('exit');
    }
  };

  const handleEnterStrokeColorChange = (color) => {
    setSelectedShapeColor(color);
    if (selectedShape === 'enter') {
      const activeObject = canvas.getActiveObject();
      activeObject.item(0).set('stroke', color);
      activeObject.item(1).set('fill', color);
      canvas.renderAll();
    }
  };

  const handleExitStrokeColorChange = (color) => {
    setSelectedShapeColor(color);
    if (selectedShape === 'exit') {
      const activeObject = canvas.getActiveObject();
      activeObject.item(0).set('stroke', color);
      activeObject.item(1).set('fill', color);
      canvas.renderAll();
    }
  };

  const undo = () => {
    if (undoStack.length === 0) return;

    const lastShape = undoStack.pop();
    canvas.remove(lastShape);
    setShapesCount(prevCount => prevCount - 1);
    setRedoStack(prevStack => [...prevStack, lastShape]);
  };

  const redo = () => {
    if (redoStack.length === 0) return;

    const shapeToRedo = redoStack.pop();
    canvas.add(shapeToRedo);
    setShapesCount(prevCount => prevCount + 1);
    setUndoStack(prevStack => [...prevStack, shapeToRedo]);
    setRedoStack([]);
  };

  // const updatePolygons = useCallback(() => {
  //   const updatedPolygons = [];
  //   canvas.getObjects().forEach((object) => {
  //     const polygonPoints = object.item(0).points.map(({ x, y }) => {
  //       const transformedPoint = fabric.util.transformPoint(
  //         new fabric.Point(x - object.width / 2, y - object.height / 2),
  //         object.calcTransformMatrix()
  //       );
  //       return [transformedPoint.x, transformedPoint.y];
  //     });
  //     updatedPolygons.push(polygonPoints);
  //   });
  //   setPolygons(updatedPolygons);
  // }, [canvas]);
  const updatePolygons = useCallback(() => {
    const updatedPolygons = [];
    canvas.getObjects().forEach((object) => {
      if (object.type === 'group') {
        const polygonPoints = object.item(0).points.map(({ x, y }) => {
          const transformedPoint = fabric.util.transformPoint(
            new fabric.Point(x - object.width / 2, y - object.height / 2),
            object.calcTransformMatrix()
          );
          return [transformedPoint.x, transformedPoint.y];
        });
        const polygonColor = rgbToHexa(object.fill);

        updatedPolygons.push({
          points: fitShape(parentWidth, parentHeight, 1020, 500, polygonPoints),
          color: polygonColor,
        });
      }
    });
    setPolygons(updatedPolygons);
  }, [canvas]);

  useEffect(() => {
    const handleObjectModified = () => {
      updatePolygons();
    };

    if (canvas) {
      canvas.on('object:modified', handleObjectModified);
    }

    return () => {
      if (canvas) {
        canvas.off('object:modified', handleObjectModified);
      }
    };
  }, [canvas, updatePolygons]);

  // const savePoints = () => {
  //   console.log(polygons);
  //   console.log(
  //     {
  //       "video_path": videoFile.fileName,
  //       "program": programType,
  //       "areas": polygons
  //     }
  //   )
  // };


  // const callNeotVideoProcessAPI = async () => {
  //   const response = await fetch("http://127.0.0.1:5000/get-and-process-video", {
  //     method: "POST",
  //     headers: {
  //       'Content-Type': 'application/json'
  //     },
  //     body: JSON.stringify(      {
  //       "video_path": videoFile.fileName,
  //       "program": programType,
  //       "areas": polygons
  //     })
  //   });

  //   const processedVideoBlob = await response.blob();

  //   if (response.ok) {
  //     const processedVideoUrl = URL.createObjectURL(processedVideoBlob);
  //     setProcessedVideo(processedVideoUrl)

  //     console.log("Processed video URL:", processedVideoUrl);
  //   } else {
  //     console.log('Request failed with status:', response.status);
  //   }
  // };

  // const callNeotVideoProcessAPI = async () => {
  //   try {
  //     const response = await axios.post(
  //       "http://neoterz-ai-api.uaenorth.cloudapp.azure.com:8080/get-and-process-video",
  //       {
  //         video_path: videoFile.fileName,
  //         program: programType,
  //         areas: polygons
  //       },
  //       {
  //         headers: {
  //           'Content-Type': 'application/json'
  //         }
  //       }
  //     );

  //     const processedVideoBlob = new Blob([response.data]);

  //     if (response.status === 200) {
  //       const processedVideoUrl = URL.createObjectURL(processedVideoBlob);
  //       setProcessedVideo(processedVideoUrl);

  //       console.log("Processed video URL:", processedVideoUrl);
  //     } else {
  //       console.log('Request failed with status:', response.status);
  //     }
  //   } catch (error) {
  //     console.log('An error occurred:', error.message);
  //   }
  // };
  // const callNeotVideoProcessAPI = () => {
  //   console.log()
  // }
  // const

  // const callNeotVideoProcessAPI = async () => {
  //   try {
  //     const response = await axios.post("http://neoterz-ai-api.uaenorth.cloudapp.azure.com:8080/uploade-video", {
  //       // Add any data you need to send with the request
  //     });
    
  //     if (response.status === 200) {
  //       const videoBlob = new Blob([response.data]);
  //       const videoUrl = URL.createObjectURL(videoBlob);
  //       setProcessedVideo(videoUrl);
    
  //       console.log("Fetched video URL:", videoUrl);
  //     } else {
  //       console.log('Failed to fetch video with status:', response.status);
  //     }
  //   } catch (error) {
  //     console.log('An error occurred while fetching the video:', error.message);
  //   }
  // }

// const displayVideo = () => {
//   setProcessedVideo("./Visitors Counter.mp4")
// }

  const callNeotVideoProcessAPI = async () => {
    try {
      const response = await axios.post(
        "http://neoterz-ai-api.uaenorth.cloudapp.azure.com:8080/get-and-process-video",
        {
          video_path: videoFile.fileName,
          program: programType,
          areas: polygons
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.status === 200) {
        try {
          const response = await axios.post("http://neoterz-ai-api.uaenorth.cloudapp.azure.com:8080/uploade-video", {
            // Add any data you need to send with the request
          });
        
          if (response.status === 200) {
            // TO DO: Click to Download
            setProcessedVideo("https://neoterz.blob.core.windows.net/videos/Result.mp4")
        
            console.log("Fetched video URL:", videoUrl);
          } else {
            console.log('Failed to fetch video with status:', response.status);
          }
        } catch (error) {
          console.log('An error occurred while fetching the video:', error.message);
        }
      } else {
        console.log('Request failed with status:', response.status);
      }
    } catch (error) {
      console.log('An error occurred:', error.message);
    }
  };

  // const callNeotVideoProcessAPI = async () => {
  //   try {
  //     const response = await axios.post(
  //       "http://neoterz-ai-api.uaenorth.cloudapp.azure.com:8080/get-and-process-video",
  //       {
  //         video_path: videoFile.fileName,
  //         program: programType,
  //         areas: polygons
  //       },
  //       {
  //         headers: {
  //           'Content-Type': 'application/json'
  //         }
  //       }
  //     );
  //     if (response.status === 200) {
  //       setProcessedVideo("https://neoterz.blob.core.windows.net/videos/Visitors%20Counter.mp4")
  //     } else {
  //       console.log('Request failed with status:', response.status);
  //     }
  //   } catch (error) {
  //     console.log('An error occurred:', error.message);
  //   }
  // };


  return (
    <>

      {!processedVideo && <div className='w-full'>
        <div
          ref={parentRef}
          className={`relative w-full h-ful`}
          style={{ aspectRatio: '2.04/1', height: parentHeight }}
        >
          <img src={selectedFrame} alt="" className=' object-cover object-center absolute z-1 rounded-xl'
            style={{ aspectRatio: '2.04/1', height: parentHeight }}
          />
          <canvas
            ref={canvasRef}
            className='absolute top-0 left-0 bottom-0 right-0 z-2'
          />
        </div >

        <div className="flex justify-between items-center flex-wrap mt-2">

          <div className='flex gap-1'>
            <Tooltip title="Add Shape" arrow enterDelay={700} leaveDelay={100}>
              <button onClick={addShape} className={`flex items-center justify-center ${styles.controlButton}`}>
                <AiOutlineAppstoreAdd className="inline-block" />
              </button>
            </Tooltip>
            {selectedShape === 'enter' && (
              <ColorPicker
                title="Change Enter Color"
                color={selectedShapeColor}
                onChange={handleEnterStrokeColorChange}
              />
            )}
            {selectedShape === 'exit' && (
              <ColorPicker
                title="Change Exit Color"
                color={selectedShapeColor}
                onChange={handleExitStrokeColorChange}
              />
            )}

          </div>

          <div className='flex gap-1'>
            <Tooltip title="Undo" arrow enterDelay={700} leaveDelay={100}>
              <button onClick={undo} className={styles.controlButton}><FaUndoAlt /></button>
            </Tooltip>
            <Tooltip title="Redo" arrow enterDelay={700} leaveDelay={100}>
              <button onClick={redo} className={styles.controlButton}><FaRedoAlt /></button>
            </Tooltip>

          </div>

          <div className='flex gap-1'>

            <Tooltip title="Process" arrow enterDelay={700} leaveDelay={100}>
              <button onClick={callNeotVideoProcessAPI}
                className={`${styles.controlButton} flex justify-center items-center gap-2 font-poppins font-medium`}>
                <GiProcessor size={19} /> Process
              </button>
            </Tooltip>
          </div>
        </div>

      </div >}

      {/* {processedVideo && <DisplayProcessedVideo processedVideo={processedVideo}/>} */}
      {processedVideo &&
<div>
<a href={processedVideo} style={{ backgroundColor: '#5fc8d1', color:'black' }} className="text-white text-xl font-semibold px-4 py-2 hover:bg-teal-400 rounded-full border border-teal-300 hover:border-teal-500 transition-colors">Click to Download</a>

</div>
      }

    </>
  );
};

export default VisitorsCounter;