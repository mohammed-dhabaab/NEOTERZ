import fitShape from '../fitShape';

describe('fitShape', () => {
    it('should scale the rectangle correctly', () => {
        const originalWidth = 10;
        const originalHeight = 8;
        const newWidth = 20;
        const newHeight = 16;
        const rectangle = [[0, 0], [5, 4], [10, 8]];

        const transformedRectangle = fitShape(originalWidth, originalHeight, newWidth, newHeight, rectangle);

        expect(transformedRectangle).toEqual([[0, 0], [10, 8], [20, 16]]);
    });

    it('should return the same rectangle if original and new dimensions are the same', () => {
        const originalWidth = 10;
        const originalHeight = 8;
        const newWidth = 10;
        const newHeight = 8;
        const rectangle = [[0, 0], [5, 4], [10, 8]];

        const transformedRectangle = fitShape(originalWidth, originalHeight, newWidth, newHeight, rectangle);

        expect(transformedRectangle).toEqual(rectangle);
    });
});