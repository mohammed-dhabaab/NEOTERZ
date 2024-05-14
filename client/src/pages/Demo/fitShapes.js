// RectangleTransform.js
const fitShapes = (originalWidth, originalHeight, newWidth, newHeight, rectangles) => {
  const scaleX = newWidth / originalWidth;
  const scaleY = newHeight / originalHeight;

  const fitShapes = rectangles.map(rectangle => {
    return rectangle.map(point => {
      const [x, y] = point;
      const newX = x * scaleX;
      const newY = y * scaleY;
      return [newX, newY];
    });
  });

  return fitShapes;
};

export default fitShapes;