const fitShape = (originalWidth, originalHeight, newWidth, newHeight, rectangle) => {
  const scaleX = newWidth / originalWidth;
  const scaleY = newHeight / originalHeight;

  const transformedRectangle = rectangle.map(point => {
    const [x, y] = point;
    const newX = x * scaleX;
    const newY = y * scaleY;
    return [newX, newY];
  });

  return transformedRectangle;
};

export default fitShape;