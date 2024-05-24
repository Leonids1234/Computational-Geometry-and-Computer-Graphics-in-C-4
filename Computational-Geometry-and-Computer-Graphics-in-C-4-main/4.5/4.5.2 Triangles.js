class Point3D {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    subtract(point) {
        return new Point3D(this.x - point.x, this.y - point.y, this.z - point.z);
    }

    add(point) {
        return new Point3D(this.x + point.x, this.y + point.y, this.z + point.z);
    }

    multiply(scalar) {
        return new Point3D(this.x * scalar, this.y * scalar, this.z * scalar);
    }

    dotProduct(point) {
        return this.x * point.x + this.y * point.y + this.z * point.z;
    }

    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    classify(triangle) {
        const v = this.subtract(triangle.vertices[0]);
        const len = v.length();
        if (len === 0.0) return 'ON';
        const unitV = v.multiply(1.0 / len);
        const d = unitV.dotProduct(triangle.normal);
        if (d > 1e-12) return 'POSITIVE';
        else if (d < -1e-12) return 'NEGATIVE';
        else return 'ON';
    }
}

class Triangle3D {
    constructor(v0, v1, v2) {
        this.vertices = [v0, v1, v2];
        this.normal = this.computeNormal();
    }

    computeNormal() {
        const v0v1 = this.vertices[1].subtract(this.vertices[0]);
        const v0v2 = this.vertices[2].subtract(this.vertices[0]);
        return v0v1.crossProduct(v0v2).normalize();
    }
}

Point3D.prototype.crossProduct = function (point) {
    return new Point3D(
        this.y * point.z - this.z * point.y,
        this.z * point.x - this.x * point.z,
        this.x * point.y - this.y * point.x
    );
};

Point3D.prototype.normalize = function () {
    const len = this.length();
    return new Point3D(this.x / len, this.y / len, this.z / len);
};

var createScene = function () {
    var scene = new BABYLON.Scene(engine);

    var camera = new BABYLON.ArcRotateCamera("Camera", 3 * Math.PI / 2, Math.PI / 4, 8, BABYLON.Vector3.Zero(), scene);
    camera.attachControl(canvas, true);

    var light = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(1, 1, 0), scene);
    light.intensity = 0.5;

    // Define vertices for the 3D triangle (tetrahedron)
    var positions = [
        0, 1, 0, // Top vertex
        -1, 0, -1, // Base vertices
        1, 0, -1,
        0, 0, 1
    ];

    var indices = [
        0, 1, 2, // Side triangles
        0, 2, 3,
        0, 3, 1,
        1, 3, 2 // Base triangle
    ];

    // UVs for texture mapping (if needed)
    var uvs = [];
    for (var p = 0; p < positions.length / 3; p++) {
        uvs.push(positions[3 * p] / 2 + 0.5, positions[3 * p + 2] / 2 + 0.5);
    }

    var customMesh = new BABYLON.Mesh("custom", scene);

    var normals = [];
    BABYLON.VertexData.ComputeNormals(positions, indices, normals);

    var vertexData = new BABYLON.VertexData();
    vertexData.positions = positions;
    vertexData.indices = indices;
    vertexData.normals = normals;
    vertexData.uvs = uvs;
    vertexData.applyToMesh(customMesh);
    customMesh.convertToFlatShadedMesh();

    var mat = new BABYLON.StandardMaterial("", scene);
    mat.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.5);
    customMesh.material = mat;

    // Create static points
    var staticPoints = [
        new BABYLON.Vector3(-0.5, 0.5, 0),
        new BABYLON.Vector3(0.5, 0.5, 0),
        new BABYLON.Vector3(0, -0.5, 0)
    ];

    staticPoints.forEach(point => {
        var pointMesh = BABYLON.MeshBuilder.CreateSphere("staticPoint", { diameter: 0.1 }, scene);
        pointMesh.position = point;
        pointMesh.material = new BABYLON.StandardMaterial("pointMaterial", scene);
        pointMesh.material.diffuseColor = new BABYLON.Color3(1, 1, 1);
    });
// Function to classify point relative to the triangle
    function classifyPoint(point, triangleVertices) {
        var p = new Point3D(point.x, point.y, point.z);
        var v0 = new Point3D(triangleVertices[0].x, triangleVertices[0].y, triangleVertices[0].z);
        var v1 = new Point3D(triangleVertices[1].x, triangleVertices[1].y, triangleVertices[1].z);
        var v2 = new Point3D(triangleVertices[2].x, triangleVertices[2].y, triangleVertices[2].z);
        var triangle = new Triangle3D(v0, v1, v2);
        return p.classify(triangle);
    }

    // Create random point
    function getRandomPoint3D() {
        return new BABYLON.Vector3(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1);
    }

    var randomPoint = getRandomPoint3D();
    var randomPointMesh = BABYLON.MeshBuilder.CreateSphere("randomPoint", { diameter: 0.2 }, scene);
    randomPointMesh.position = randomPoint;
    randomPointMesh.material = new BABYLON.StandardMaterial("randomPointMaterial", scene);

    // Function to update random point color based on classification
    function updateRandomPoint() {
        randomPoint = getRandomPoint3D();
        randomPointMesh.position = randomPoint;
        const classification = classifyPoint(randomPoint, [
            new BABYLON.Vector3(0, 1, 0),
            new BABYLON.Vector3(-1, 0, -1),
            new BABYLON.Vector3(1, 0, -1)
        ]);
        if (classification === 'POSITIVE') {
            randomPointMesh.material.diffuseColor = new BABYLON.Color3(0, 1, 0);
        } else if (classification === 'NEGATIVE') {
            randomPointMesh.material.diffuseColor = new BABYLON.Color3(1, 0, 0);
        } else {
            randomPointMesh.material.diffuseColor = new BABYLON.Color3(0, 0, 1);
        }
    }

    // Update the random point periodically
    setInterval(updateRandomPoint, 1000);

    return scene;
};