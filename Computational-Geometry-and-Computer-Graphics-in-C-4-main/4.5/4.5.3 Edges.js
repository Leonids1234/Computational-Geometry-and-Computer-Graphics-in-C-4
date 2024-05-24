var createScene = function () {
    var scene = new BABYLON.Scene(engine);
    var camera = new BABYLON.ArcRotateCamera("Camera", 3 * Math.PI / 2, Math.PI / 4, 8, BABYLON.Vector3.Zero(), scene);
    camera.attachControl(canvas, true);

    var light = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(1, 1, 0), scene);
    light.intensity = 0.5;

    // Define the positions for the vertices of the triangle
    var positions = [
        0, 1, 0,  // Vertex 0
        -1, 0, -1, // Vertex 1
        1, 0, -1,  // Vertex 2
        0, -1, 0   // Vertex 3 (for depth)
    ];

    var indices = [
        0, 1, 2, // Front face
        1, 3, 2, // Bottom face
        2, 3, 0, // Right face
        0, 3, 1  // Left face
    ];

    var normals = [];
    BABYLON.VertexData.ComputeNormals(positions, indices, normals);

    var vertexData = new BABYLON.VertexData();
    vertexData.positions = positions;
    vertexData.indices = indices;
    vertexData.normals = normals;

    var customMesh = new BABYLON.Mesh("custom", scene);
    vertexData.applyToMesh(customMesh);
    customMesh.convertToFlatShadedMesh();

    var mat = new BABYLON.StandardMaterial("mat", scene);
    mat.diffuseColor = new BABYLON.Color3(0.4, 0.4, 1);
    customMesh.material = mat;

    // Function to create an edge
    function createEdge(edge, color, scene) {
        const points = [
            new BABYLON.Vector3(edge.org.x, edge.org.y, edge.org.z),
            new BABYLON.Vector3(edge.dest.x, edge.dest.y, edge.dest.z)
        ];
        const line = BABYLON.MeshBuilder.CreateLines("line", { points: points }, scene);
        line.color = color;
    }

    // Function to display intersection point
    function displayIntersectionPoint(point, scene) {
        var sphere = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 0.1 }, scene);
        sphere.position = new BABYLON.Vector3(point.x, point.y, point.z);

        var dynamicTexture = new BABYLON.DynamicTexture("DynamicTexture", { width: 512, height: 256 }, scene, true);
        dynamicTexture.hasAlpha = true;
        var ctx = dynamicTexture.getContext();
        ctx.font = "bold 44px Arial";
        dynamicTexture.drawText(${point.x.toFixed(2)}, ${point.y.toFixed(2)}, ${point.z.toFixed(2)}, 75, 135, "white");

        var plane = BABYLON.MeshBuilder.CreatePlane("textPlane", { size: 1 }, scene);
        plane.position = new BABYLON.Vector3(point.x, point.y + 0.2, point.z);
        var planeMaterial = new BABYLON.StandardMaterial("textPlaneMaterial", scene);
        planeMaterial.diffuseTexture = dynamicTexture;
        plane.material = planeMaterial;
    }

    class Point3D {
        constructor(x, y, z) {
            this.x = x;
            this.y = y;
            this.z = z;
        }

        add(point) {
            return new Point3D(this.x + point.x, this.y + point.y, this.z + point.z);
        }

        subtract(point) {
            return new Point3D(this.x - point.x, this.y - point.y, this.z - point.z);
        }

        dotProduct(point) {
            return this.x * point.x + this.y * point.y + this.z * point.z;
        }

        multiply(scalar) {
            return new Point3D(this.x * scalar, this.y * scalar, this.z * scalar);
        }

        length() {
            return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
        }

        crossProduct(point) {
            return new Point3D(
                this.y * point.z - this.z * point.y,
                this.z * point.x - this.x * point.z,
                this.x * point.y - this.y * point.x
            );
        }

        normalize() {
            var len = this.length();
            return new Point3D(this.x / len, this.y / len, this.z / len);
        }
    }

    class Triangle3D {
        constructor(v0, v1, v2) {
            this.vertices = [v0, v1, v2];
            this.normal = this.calculateNormal();
        }
calculateNormal() {
            const v0 = this.vertices[0];
            const v1 = this.vertices[1];
            const v2 = this.vertices[2];
            const edge1 = v1.subtract(v0);
            const edge2 = v2.subtract(v0);
            return edge1.crossProduct(edge2).normalize();
        }

        classifyPoint(point) {
            const v0 = this.vertices[0];
            const vector = point.subtract(v0);
            const distance = vector.length();
            if (distance === 0) return 'ON';
            const unitVector = vector.multiply(1 / distance);
            const dot = unitVector.dotProduct(this.normal);
            if (dot > 1e-12) return 'POSITIVE';
            if (dot < -1e-12) return 'NEGATIVE';
            return 'ON';
        }
    }

    class Edge3D {
        constructor(org, dest) {
            this.org = org;
            this.dest = dest;
        }

        intersect(triangle, t) {
            const a = this.org;
            const b = this.dest;
            const c = triangle.vertices[0];
            const n = triangle.normal;
            const denom = n.dotProduct(b.subtract(a));
            if (denom === 0) {
                const classification = triangle.classifyPoint(this.org);
                if (classification !== 'ON') return 'PARALLEL';
                return 'COLLINEAR';
            }
            const num = n.dotProduct(a.subtract(c));
            t.value = -num / denom;
            return 'SKEW';
        }

        getPoint(t) {
            return this.org.add(this.dest.subtract(this.org).multiply(t));
        }
    }

    const triangle = new Triangle3D(
        new Point3D(0, 1, 0),
        new Point3D(-1, 0, -1),
        new Point3D(1, 0, -1)
    );

    const edges = [
        new Edge3D(new Point3D(-2, 0, 0), new Point3D(2, 0, 0)), // Parallel to plane
        new Edge3D(new Point3D(-1, 0, -1), new Point3D(1, 0, -1)), // Lying on the plane
        new Edge3D(new Point3D(-2, -2, -2), new Point3D(2, 2, 2)), // Intersecting the plane
        new Edge3D(new Point3D(0, 2, 0), new Point3D(0, -2, 0))  // Additional intersecting line
    ];

    const colors = {
        'PARALLEL': BABYLON.Color3.Red(),
        'COLLINEAR': BABYLON.Color3.Yellow(),
        'SKEW': BABYLON.Color3.Green()
    };

    edges.forEach(edge => {
        let t = { value: 0 };
        const result = edge.intersect(triangle, t);
        const color = colors[result] || colors['SKEW'];
        createEdge(edge, color, scene);

        if (result === 'SKEW') {
            const intersectionPoint = edge.getPoint(t.value);
            displayIntersectionPoint(intersectionPoint, scene);
        }
    });

    return scene;
};