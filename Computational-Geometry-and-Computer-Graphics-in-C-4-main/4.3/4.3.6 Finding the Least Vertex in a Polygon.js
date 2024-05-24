class Vertex {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

function leastVertex(p, cmp) {
    let bestV = p[0];
    for (let i = 1; i < p.length; i++) {
        if (cmp(p[i], bestV) < 0) {
            bestV = p[i];
        }
    }
    return bestV;
}

function leftToRightCmp(a, b) {
    if (a.x < b.x) return -1;
    if (a.x > b.x) return 1;
    if (a.y < b.y) return -1;
    if (a.y > b.y) return 1;
    return 0;
}

function rightToLeftCmp(a, b) {
    return leftToRightCmp(b, a);
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

    // Define polygon vertices
    var polygonVertices = [
        new Vertex(-1, -1),
        new Vertex(1, -2),
        new Vertex(1, 1),
        new Vertex(0, 2),
        new Vertex(-1, 1)
    ];

    // Create polygon lines
    var polygonPoints = [];
    for (let i = 0; i < polygonVertices.length; i++) {
        polygonPoints.push(new BABYLON.Vector3(polygonVertices[i].x, polygonVertices[i].y, 0));
    }
    // Add the first vertex at the end to close the polygon
    polygonPoints.push(new BABYLON.Vector3(polygonVertices[0].x, polygonVertices[0].y, 0));

    var polygonMesh = BABYLON.MeshBuilder.CreateLines("polygon", { points: polygonPoints }, scene);
    polygonMesh.color = new BABYLON.Color3(1, 1, 1); // White color

    // Find the least vertex using left-to-right comparison
    let least = leastVertex(polygonVertices, leftToRightCmp);

    // Visualize the least vertex
    var leastVertexMesh = BABYLON.MeshBuilder.CreateSphere("leastVertex", { diameter: 0.3 }, scene);
    leastVertexMesh.position = new BABYLON.Vector3(least.x, least.y, 0);
    leastVertexMesh.material = new BABYLON.StandardMaterial("leastVertexMaterial", scene);
    leastVertexMesh.material.diffuseColor = new BABYLON.Color3(0, 1, 0); // Green color

    return scene;
};