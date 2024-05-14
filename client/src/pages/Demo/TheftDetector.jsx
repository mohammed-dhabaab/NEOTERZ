import React, { useRef, useState, useEffect, useCallback } from 'react';
import { fabric } from 'fabric';
import frame from "../../../frame.jpg"
import styles from '../../styles';

import ColorPicker from './ColorPicker';

import { Tooltip } from '@mui/material';
import { FaUndoAlt, FaRedoAlt } from "react-icons/fa";
import { IoSave } from "react-icons/io5";
import { AiOutlineAppstoreAdd } from "react-icons/ai";
import { GiProcessor } from "react-icons/gi";


const TheftDetector = ({ selectedFrame, fileName }) => {
  const [parentWidth, setParentWidth] = useState(0);
  const parentRef = useRef(null);

  const [canvas, setCanvas] = useState(null);
  const [shapes, setShapes] = useState([]);
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  const [selectedShape, setSelectedShape] = useState(1);
  const [selectedShapeIndex, setSelectedShapeIndex] = useState(null);

  const [selectedShapeColor, setSelectedShapeColor] = useState('#000000');
  const [polygons, setPolygons] = useState([]);


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
    if (!canvas) return;
  
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
  
    const text = new fabric.Text(selectedShape.toString(), {
      left: rect.left + rect.width / 2,
      top: rect.top + rect.height / 2,
      fontSize: 20,
      fill: selectedShapeColor,
      originX: 'center',
      originY: 'center',
    });
  
    const group = new fabric.Group([rect, text]);
  
    canvas.add(group);
    setShapes(prevShapes => [...prevShapes, group]);
    setUndoStack(prevStack => [...prevStack, group]);
    
    setSelectedShapeIndex(prevIndex => prevIndex === null ? 0 : prevIndex + 1);
    setSelectedShape(selectedShape + 1);
  };

  const handleStrokeColorChange = (shapeIndex, color) => {
    const updatedShapes = shapes.map((shape, index) => {
      if (index === shapeIndex) {
        shape.item(0).set('stroke', color);
        shape.item(1).set('fill', color);
      }
      return shape;
    });
  
    setShapes(updatedShapes);
    canvas.renderAll();
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

  const updatePolygons = useCallback(() => {
    const updatedPolygons = [];
    canvas.getObjects().forEach((object) => {
      const polygonPoints = object.item(0).points.map(({ x, y }) => {
        const transformedPoint = fabric.util.transformPoint(
          new fabric.Point(x - object.width / 2, y - object.height / 2),
          object.calcTransformMatrix()
        );
        return [transformedPoint.x, transformedPoint.y];
      });
      updatedPolygons.push(polygonPoints);
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

  const savePoints = () => {
    console.log(polygons);
  };


  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };


  return (
    <div className='w-full'>
      <div
        ref={parentRef}
        className={`relative w-full h-ful`}
        style={{ aspectRatio: '2.04/1', height: parentHeight }}
      >
        <img src={selectedFrame} alt="" className='w-full object-cover object-center absolute z-1 rounded-xl' 
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
          {shapes.map((shape, index) => (
          <div key={index} className="flex gap-1">
            {index === selectedShapeIndex && (
              <ColorPicker
                title={`Change Color ${index + 1}`}
                color={shape.item(0).stroke}
                onChange={(color) => handleStrokeColorChange(index, color)}
              />
            )}
          </div>
        ))}

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
          <Tooltip title="Save" arrow enterDelay={700} leaveDelay={100}>
            <button onClick={savePoints} className={styles.controlButton}><IoSave /></button>
          </Tooltip>

          <Tooltip title="Process" arrow enterDelay={700} leaveDelay={100}>
            <button className={styles.controlButton}><GiProcessor /></button>
          </Tooltip>

        </div>
      </div>


      <label className='text-white'>
        <input
          type="checkbox"
          checked={isChecked}
          onChange={handleCheckboxChange}
          className='cursor-pointer'
        />
        Display areas after processing
      </label>
    </div >
  );
};

export default TheftDetector;