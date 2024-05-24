class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    subtract(point) {
        return new Point(this.x - point.x, this.y - point.y);
    }

    add(point) {
        return new Point(this.x + point.x, this.y + point.y);
    }

    multiply(scalar) {
        return new Point(this.x * scalar, this.y * scalar);
    }

    dotProduct(point) {
        return this.x * point.x + this.y * point.y;
    }

    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
}

class Edge {
    constructor(org, dest) {
        this.org = org;
        this.dest = dest;
    }

    intersect(edge, t) {
        const a = this.org;
        const b = this.dest;
        const c = edge.org;
        const d = edge.dest;
        const n = new Point(d.y - c.y, c.x - d.x);
        const denom = n.dotProduct(b.subtract(a));
        if (denom === 0.0) {
            return 'PARALLEL';
        }
        const num = n.dotProduct(a.subtract(c));
        t.value = -num / denom;
        return 'SKEW';
    }

    point(t) {
        return this.org.add(this.dest.subtract(this.org).multiply(t));
    }

    flip() {
        return new Edge(this.dest, this.org);
    }

    rot() {
        const m = this.org.add(this.dest).multiply(0.5);
        const v = this.dest.subtract(this.org);
        const n = new Point(v.y, -v.x);
        const newOrg = m.subtract(n.multiply(0.5));
        const newDest = m.add(n.multiply(0.5));
        return new Edge(newOrg, newDest);
    }

    distance(point) {
        const flippedRotatedEdge = this.flip().rot();
        const n = flippedRotatedEdge.dest.subtract(flippedRotatedEdge.org).multiply(1.0 / flippedRotatedEdge.dest.subtract(flippedRotatedEdge.org).length());
        const perpendicularEdge = new Edge(point, point.add(n));
        let t = { value: 0 };
        perpendicularEdge.intersect(this, t);
        return t.value * flippedRotatedEdge.dest.subtract(flippedRotatedEdge.org).length();
    }
}

var createScene = function () {
    var scene = new BABYLON.Scene(engine);
    var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, -10), scene);
    camera.setTarget(BABYLON.Vector3.Zero());
    camera.attachControl(canvas, true);

    var light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
    light.intensity = 0.7;

    function getRandomPoint() {
        return new Point(Math.random() * 6 - 3, Math.random() * 6 - 3);
    }

    function createEdge(edge, scene) {
        const points = [
            new BABYLON.Vector3(edge.org.x, edge.org.y, 0),
            new BABYLON.Vector3(edge.dest.x, edge.dest.y, 0)
        ];
        const line = BABYLON.MeshBuilder.CreateLines("line", { points }, scene);
        line.color = BABYLON.Color3.White();
    }

    function createPoint(point, scene) {
        const sphere = BABYLON.MeshBuilder.CreateSphere("point", { diameter: 0.3 }, scene);
        sphere.position = new BABYLON.Vector3(point.x, point.y, 0);
        sphere.material = new BABYLON.StandardMaterial("pointMaterial", scene);
        sphere.material.diffuseColor = BABYLON.Color3.Red();
    }

    const org = getRandomPoint();
    const dest = getRandomPoint();
    const point = getRandomPoint();

    const edge = new Edge(org, dest);
    createEdge(edge, scene);
    createPoint(point, scene);

    const distance = edge.distance(point);

    const textPlane = BABYLON.MeshBuilder.CreatePlane("textPlane", { size: 15 }, scene);
    textPlane.position = new BABYLON.Vector3(0, 3, 0);

    const advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateForMesh(textPlane);
    const textBlock = new BABYLON.GUI.TextBlock();
    textBlock.text = "Distance: " + Math.abs(distance.toFixed(2));
    textBlock.color = "white";
    textBlock.fontSize = 24;
    advancedTexture.addControl(textBlock);

    return scene;
};