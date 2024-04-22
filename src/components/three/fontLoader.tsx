import {
    FileLoader,
    Loader,
    ShapePath
} from 'three';

interface FontData {
    resolution: number;
    boundingBox: { yMax: number, yMin: number, underlineThickness: number };
    underlineThickness?: number;
    glyphs: { [key: string]: Glyph };
    familyName: string;
}

interface Glyph {
    ha: number; // horizontal advance
    o: string; // outline command string
    _cachedOutline?: string[];
}

class FontLoader extends Loader {
    constructor(manager?: any) {
        super(manager);
    }

    load(url: string, onLoad?: (font: Font) => void, onProgress?: (event: ProgressEvent) => void, onError?: (event: ErrorEvent) => void): void {
        const loader = new FileLoader(this.manager);
        loader.setPath(this.path);
        loader.setRequestHeader(this.requestHeader);
        loader.setWithCredentials(this.withCredentials);
        loader.load(url, (data: string | ArrayBuffer) => {
            if (typeof data === 'string') {
                const font = this.parse(JSON.parse(data));
                if (onLoad) onLoad(font);
            } else {
                // Handle ArrayBuffer case or throw an error
                console.error('Expected string data');
            }
        }, onProgress);
    }

    parse(json: any): Font {
        return new Font(json);
    }
}

class Font {
    isFont: boolean = true;
    type: string = 'Font';
    data: FontData;

    constructor(data: FontData) {
        this.data = data;
    }

    generateShapes(text: string, size: number = 100): ShapePath[] {
        const shapes: ShapePath[] = [];
        const results = createPaths(text, size, this.data);
    
        for (let result of results) {
            shapes.push(result.path);
        }
    
        return shapes;
    }
    
}

function createPaths(text: string, size: number, data: FontData): PathResult[] {
    const chars = Array.from(text);
    const scale = size / data.resolution;
    const line_height = (data.boundingBox.yMax - data.boundingBox.yMin + (data.underlineThickness || 0)) * scale;

    const paths: PathResult[] = [];
    let offsetX = 0, offsetY = 0;

    for (let i = 0; i < chars.length; i++) {
        const char = chars[i];

        if (char === '\n') {
            offsetX = 0;
            offsetY -= line_height;
        } else {
            const ret = createPath(char, scale, offsetX, offsetY, data);
            offsetX += ret.offsetX;
            paths.push(ret);
        }
    }

    return paths;
}

interface PathResult {
    offsetX: number;
    path: ShapePath;
}

function createPath(char: string, scale: number, offsetX: number, offsetY: number, data: FontData): PathResult {
    const glyph = data.glyphs[char] || data.glyphs['?'];

    if (!glyph) {
        console.error(`THREE.Font: character "${char}" does not exist in font family ${data.familyName}.`);
        return { offsetX: 0, path: new ShapePath() }; // return a default path if glyph is not found
    }

    const path = new ShapePath();
    let action: string, x: number, y: number, cpx: number, cpy: number, cpx1: number, cpy1: number, cpx2: number, cpy2: number;

    const outline = glyph._cachedOutline || (glyph._cachedOutline = glyph.o.split(' '));

    for (let i = 0, l = outline.length; i < l; ) {
        action = outline[i++];
        let x: number, y: number, cpx: number, cpy: number, cpx1: number, cpy1: number, cpx2: number, cpy2: number;

        switch (action) {
            case 'm': // moveTo
                x = parseFloat(outline[i++]) * scale + offsetX;
                y = parseFloat(outline[i++]) * scale + offsetY;
                path.moveTo(x, y);
                break;
            case 'l': // lineTo
                x = parseFloat(outline[i++]) * scale + offsetX;
                y = parseFloat(outline[i++]) * scale + offsetY;
                path.lineTo(x, y);
                break;
            case 'q': // quadraticCurveTo
                cpx = parseFloat(outline[i++]) * scale + offsetX;
                cpy = parseFloat(outline[i++]) * scale + offsetY;
                cpx1 = parseFloat(outline[i++]) * scale + offsetX;
                cpy1 = parseFloat(outline[i++]) * scale + offsetY;
                path.quadraticCurveTo(cpx1, cpy1, cpx, cpy);
                break;
            case 'b': // bezierCurveTo
                cpx1 = parseFloat(outline[i++]) * scale + offsetX;
                cpy1 = parseFloat(outline[i++]) * scale + offsetY;
                cpx2 = parseFloat(outline[i++]) * scale + offsetX;
                cpy2 = parseFloat(outline[i++]) * scale + offsetY;
                cpx = parseFloat(outline[i++]) * scale + offsetX;
                cpy = parseFloat(outline[i++]) * scale + offsetY;
                path.bezierCurveTo(cpx1, cpy1, cpx2, cpy2, cpx, cpy);
                break;
        }
    }

    return { offsetX: glyph.ha * scale, path: path };
}

export { FontLoader, Font };
