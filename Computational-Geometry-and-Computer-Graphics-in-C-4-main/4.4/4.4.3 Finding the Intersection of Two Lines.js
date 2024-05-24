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

    classify(edge) {
        const p1 = edge.dest.subtract(edge.org);
        const p2 = this.subtract(edge.org);
        const cross = p1.x * p2.y - p1.y * p2.x;
        if (cross > 0) return 'LEFT';
        if (cross < 0) return 'RIGHT';
        return 'COLLINEAR';
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
            const aclass = this.org.classify(edge);
            if (aclass === 'LEFT' || aclass === 'RIGHT') {
                return 'PARALLEL';
            } else {
                return 'COLLINEAR';
            }
        }
        const num = n.dotProduct(a.subtract(c));
        t.value = -num / denom;
        return 'SKEW';
    }

    point(t) {
        return this.org.add(this.dest.subtract(this.org).multiply(t));
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

    function createExtendedEdge(edge, scene) {
        const direction = edge.dest.subtract(edge.org);
        const extendedOrg = edge.org.add(direction.multiply(-5));
        const extendedDest = edge.dest.add(direction.multiply(5));

        const points = [
            new BABYLON.Vector3(extendedOrg.x, extendedOrg.y, 0),
            new BABYLON.Vector3(extendedDest.x, extendedDest.y, 0)
        ];

        const line = BABYLON.MeshBuilder.CreateLines("line", { points }, scene);
        line.color = BABYLON.Color3.White();
    }

    const org1 = getRandomPoint();
    const dest1 = getRandomPoint();
    const org2 = getRandomPoint();
    const dest2 = getRandomPoint();

    const edge1 = new Edge(org1, dest1);
    const edge2 = new Edge(org2, dest2);

    createExtendedEdge(edge1, scene);
    createExtendedEdge(edge2, scene);

    let t = { value: 0 };
    const result = edge1.intersect(edge2, t);
    if (result === 'SKEW') {
        const intersectionPoint = edge1.point(t.value);
        const sphere = BABYLON.MeshBuilder.CreateSphere("intersectionPoint", { diameter: 0.3 }, scene);
        sphere.position = new BABYLON.Vector3(intersectionPoint.x, intersectionPoint.y, 0);
        sphere.material = new BABYLON.StandardMaterial("intersectionPointMaterial", scene);
        sphere.material.diffuseColor = BABYLON.Color3.Green();
    }

    return scene;
};