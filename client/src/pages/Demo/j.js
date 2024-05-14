const originalWidth = 1167;
const originalHeight = 572.047;
const newWidth = 1020;
const newHeight = 500;

const scaleX = newWidth / originalWidth;
const scaleY = newHeight / originalHeight;

const rectangles = [[[291.50732948018685,352.1990983433701],[610.4260795997534,506.2986709179313],[582.6681709203631,563.7454074277352],[263.74942080079654,409.64583485317405]],[[243.26697344338427,413.3006011134501],[578.0778754625165,563.9562283284656],[550.0641687312918,626.2127440190125],[215.25326671215953,475.55711680399696]]];

const transformedRectangles = rectangles.map(rectangle => {
return rectangle.map(point => {
const [x, y] = point;
const newX = x * scaleX;
const newY = y * scaleY;
return [newX, newY];
});
});

console.log(transformedRectangles)