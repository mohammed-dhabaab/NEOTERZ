const rgbToHexa = require("../rgbToHexa");

describe('rgbToHexa', () => {
    test('converts RGB color to hexadecimal', () => {
        expect(rgbToHexa('rgb(255, 128, 0)')).toBe('#ff8000');
        expect(rgbToHexa('rgb(0, 0, 0)')).toBe('#000000');
        expect(rgbToHexa('rgb(255, 255, 255)')).toBe('#ffffff');
    });
});