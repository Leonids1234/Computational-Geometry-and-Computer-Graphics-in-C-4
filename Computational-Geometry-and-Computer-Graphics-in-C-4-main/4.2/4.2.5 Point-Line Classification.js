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
        if ((a.x * b.x < 0.0) || (a.y * b.y < 0.0)) return 'BEHIND';
        if (a.length() < b.length()) return 'BEYOND';
        if (p0.equals(p2)) return 'ORIGIN';
        if (p1.equals(p2)) return 'DESTINATION';
        return 'BETWEEN';
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

    // Создание статической линии
    var p0 = new Point(-2, 0);
    var p1 = new Point(2, 0);
    
    var line = BABYLON.MeshBuilder.CreateLines("line", {
        points: [
            new BABYLON.Vector3(p0.x, p0.y, 0),
            new BABYLON.Vector3(p1.x, p1.y, 0)
        ]
    }, scene);
    line.color = BABYLON.Color3.White();

    function getColor(classification) {
        switch (classification) {
            case 'LEFT':
                return BABYLON.Color3.FromHexString("#FF0000"); // Red
            case 'RIGHT':
                return BABYLON.Color3.FromHexString("#0000FF"); // Blue
            case 'BEHIND':
                return BABYLON.Color3.FromHexString("#FFFF00"); // Yellow
            case 'BEYOND':
                return BABYLON.Color3.FromHexString("#800080"); // Purple
            case 'ORIGIN':
                return BABYLON.Color3.FromHexString("#00FF00"); // Green
            case 'DESTINATION':
                return BABYLON.Color3.FromHexString("#FFA500"); // Orange
            case 'BETWEEN':
                return BABYLON.Color3.FromHexString("#808080"); // Gray
            default:
                return BABYLON.Color3.White();
        }
    }
    
    function createPointMesh(point, color, scene) {
        var pointMesh = BABYLON.MeshBuilder.CreateSphere("point", { diameter: 0.2 }, scene);
        pointMesh.position = new BABYLON.Vector3(point.x, point.y, 0);
        pointMesh.material = new BABYLON.StandardMaterial("pointMaterial", scene);
        pointMesh.material.diffuseColor = color;
    }

        // Создание и классификация статических точек
    var points = [
        { point: new Point(-3, -1), classification: 'BEHIND' },
        { point: new Point(3, 1), classification: 'BEYOND' },
        { point: new Point(-2, 0), classification: 'ORIGIN' },
        { point: new Point(2, 0), classification: 'DESTINATION' },
        { point: new Point(0, 0), classification: 'BETWEEN' }
    ];

    points.forEach(item => {
        const color = getColor(item.classification);
        createPointMesh(item.point, color, scene);
    });

    // Генерация случайной точки
    var randomPoint = new Point(Math.random() * 4 - 2, Math.random() * 4 - 2);
    var classification = randomPoint.classify(p0, p1);
    var color = getColor(classification);
    createPointMesh(randomPoint, color, scene);

    return scene;
};