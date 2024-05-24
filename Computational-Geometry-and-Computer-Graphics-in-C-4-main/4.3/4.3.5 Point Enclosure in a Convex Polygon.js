const CLOCKWISE = 1;
const COUNTERCLOCKWISE = -1;

class Point {
    constructor(x = 0.0, y = 0.0) {
        this.x = x;
        this.y = y;
    }

    // Вычитание точек
    subtract(point) {
        return new Point(this.x - point.x, this.y - point.y);
    }

    // Проверка на равенство
    equals(point) {
        return this.x === point.x && this.y === point.y;
    }

    // Длина вектора
    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    // Классификация точки относительно линии
    classify(p0, p1) {
        const p2 = this;
        const a = p1.subtract(p0);
        const b = p2.subtract(p0);
        const sa = a.x * b.y - b.x * a.y;

        if (sa > 0.0) return 'LEFT';
        if (sa < 0.0) return 'RIGHT';
        if ((a.x * b.x < 0.0)  (a.y * b.y < 0.0)) return 'BEHIND';
        if (a.length() < b.length()) return 'BEYOND';
        if (p0.equals(p2)) return 'ORIGIN';
        if (p1.equals(p2)) return 'DESTINATION';
        return 'BETWEEN';
    }
}

class Vertex extends Point {
    constructor(x, y) {
        super(x, y);
        this.next = null;
        this.prev = null;
    }

    cw() {
        return this.next;
    }

    ccw() {
        return this.prev;
    }

    neighbor(rotation) {
        return (rotation === CLOCKWISE) ? this.cw() : this.ccw();
    }

    insert(v) {
        v.next = this.next;
        v.prev = this;
        this.next.prev = v;
        this.next = v;
        return v;
    }

    remove() {
        this.prev.next = this.next;
        this.next.prev = this.prev;
        return this.next;
    }

    splice(b) {
        let aNext = this.next;
        this.next = b.next;
        b.next = aNext;
        aNext.prev = b;
        this.next.prev = this;
    }

    split(b) {
        let bp = b.ccw().insert(new Vertex(b.x, b.y));
        this.insert(new Vertex(this.x, this.y));
        this.splice(bp);
        return bp;
    }
}

class Polygon {
    constructor(vertices) {
        this._v = null;
        this._size = 0;
        if (vertices && vertices.length > 0) {
            vertices.forEach(vertex => this.insert(new Point(vertex.x, vertex.y)));
        }
    }

    size() {
        return this._size;
    }

    insert(p) {
        if (this._size === 0) {
            this._v = new Vertex(p.x, p.y);
            this._v.next = this._v;
            this._v.prev = this._v;
        } else {
            this._v = this._v.insert(new Vertex(p.x, p.y));
        }
        this._size++;
        return this._v;
    }

    v() {
        return this._v;
    }

    advance(rotation) {
        this._v = this._v.neighbor(rotation);
        return this._v;
    }

    setV(v) {
        this._v = v;
        return this._v;
    }

    point() {
        return new Point(this._v.x, this._v.y);
    }

    edge() {
        return { p0: this.point(), p1: new Point(this._v.cw().x, this._v.cw().y) };
    }
}

var createScene = function () {

    // This creates a basic Babylon Scene object (non-mesh)
    var scene = new BABYLON.Scene(engine);

    // This creates and positions a free camera (non-mesh)
    var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);

    // This targets the camera to scene origin
    camera.setTarget(BABYLON.Vector3.Zero());

    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);

    // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

    // Default intensity is 1. Let's dim the light a small amount
    light.intensity = 0.7;

    function pointInConvexPolygon(s, p) {
        if (p.size() === 1) {
            return s.equals(p.point());
        }
        if (p.size() === 2) {
            let c = s.classify(p.edge().p0, p.edge().p1);
            return (c === 'BETWEEN'  c === 'ORIGIN' || c === 'DESTINATION');
        }
        let org = p.v();
        for (let i = 0; i < p.size(); i++, p.advance(CLOCKWISE)) {
            if (s.classify(p.edge().p0, p.edge().p1) === 'LEFT') {
p.setV(org);
                return false;
            }
        }
        return true;
    }

    // Create polygon
    var vertices = [
        new Point(-2, -1),
        new Point(0, 2),
        new Point(2, -1),
        new Point(1, -2),
        new Point(-1, -2)
    ];
    var polygon = new Polygon(vertices);

    // Create polygon mesh
    var polygonMesh = BABYLON.MeshBuilder.CreateLines("polygon", {
        points: vertices.map(v => new BABYLON.Vector3(v.x, v.y, 0)).concat([new BABYLON.Vector3(vertices[0].x, vertices[0].y, 0)])
    }, scene);
    polygonMesh.color = BABYLON.Color3.White();

    // Generate random point
    var randomPoint = new Point(Math.random() * 4 - 2, Math.random() * 4 - 2);

    // Check if point is in the polygon
    var isInPolygon = pointInConvexPolygon(randomPoint, polygon);
    var pointColor = isInPolygon ? BABYLON.Color3.Green() : BABYLON.Color3.Red();

    // Create point mesh
    var pointMesh = BABYLON.MeshBuilder.CreateSphere("point", { diameter: 0.2 }, scene);
    pointMesh.position = new BABYLON.Vector3(randomPoint.x, randomPoint.y, 0);
    pointMesh.material = new BABYLON.StandardMaterial("pointMaterial", scene);
    pointMesh.material.diffuseColor = pointColor;

    return scene;
};