var canvas; // The drawing surface.
var scene; // The root scene graph node.
var camera;
var renderer;

var submarine; // The submarine.
var subRotor; // The submarine's rotor.

function init() {
    try {
        canvas = document.getElementById("viewport");
        scene = new THREE.Scene();
        buildWorld(); // Construct the application's scene graph.

        var cameraAspectRatio = canvas.width / canvas.height;
        camera = new THREE.PerspectiveCamera(45, cameraAspectRatio, 1, 1000);
        camera.position.z = 100;
        camera.position.y = 40;
        camera.rotation.x = -0.1;

        renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
        renderer.setClearColor(0xeeeeee);
        renderer.render(scene, camera);
        animate();
    } catch (e) {
        var errorOutput = document.getElementById("error-message");
        errorOutput.innerHTML = "<h1>Enable WebGL to continue.</h1>";
        return;
    }
}

function buildWorld() {
    var submarine = createSubmarine();
    submarine.scale.set(0.4, 0.4, 0.4);
    submarine.position.y = -5;

    var shooter = createShooter();
    shooter.position.set(0, 40, 20);
    shooter.rotation.x = -Math.atan(40 / 20);
    shooter.rotation.y = Math.PI;

    scene.add(submarine);
    scene.add(shooter);

    // Configure lighting for the scene.
    var light = new THREE.DirectionalLight();
    light.position.set(0, 0, 100);
    scene.add(light);
}

function createSubmarine() {
    var subBody = createSubBody();
    var subTower = createSubTower();
    var subRotor = createSubRotor();

    // Create the submarine.
    submarine = new THREE.Object3D();
    submarine.add(subBody);
    submarine.add(subTower);
    submarine.add(subRotor);
    return submarine;
}

function createSubBody() {
    var subBodyGeometry = new THREE.SphereGeometry(10, 100, 100);
    var subBodyMaterial = new THREE.MeshLambertMaterial({ color: 0x000000 });
    var subBody = new THREE.Mesh(subBodyGeometry, subBodyMaterial);
    subBody.scale.x = 4;
    return subBody;
}

function createSubTower() {
    var subTopGeometry = new THREE.BoxGeometry(10, 5, 7);
    var subTopMaterial = new THREE.MeshLambertMaterial({ color: 0x000000 });
    var subTower = new THREE.Mesh(subTopGeometry, subTopMaterial);
    subTower.position.y = 10.5;
    return subTower;
}

function createSubRotor() {
    // Create a cylinder to construct the submarine's rotor.
    var cylinderGeometry = new THREE.CylinderGeometry(1, 1, 2, 10, 1, false);
    var cylinderMaterial = new THREE.MeshLambertMaterial({ color: 0xe5f500 });
    var cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);

    // Create cylindrical parts for the submarine's rotor.
    cylinder.scale.set(0.7, 4, 0.7);
    var rotorShaft = cylinder.clone();
    cylinder.scale.set(0.4, 2, 0.4);
    cylinder.rotation.z = Math.PI / 2;
    cylinder.position.y = -3;
    var rotorWing1 = cylinder.clone();
    cylinder.rotation.y = Math.PI / 3;
    var rotorWing2 = cylinder.clone();
    cylinder.rotation.y += Math.PI / 3;
    var rotorWing3 = cylinder.clone();

    // Create the submarine's rotor from its individual parts.
    subRotor = new THREE.Object3D();
    subRotor.add(rotorShaft);
    subRotor.add(rotorWing1);
    subRotor.add(rotorWing2);
    subRotor.add(rotorWing3);
    subRotor.rotation.z = Math.PI / 2;
    subRotor.position.x = 43;
    return subRotor;
}

function createShooter() {
    var bodyGeometry = new THREE.BoxGeometry(6, 2, 4);
    var bodyMaterial = new THREE.MeshLambertMaterial({ color: 0x0021fe });
    var body = new THREE.Mesh(bodyGeometry, bodyMaterial);

    var bombGeometry = new THREE.SphereGeometry(0.6, 100, 100);
    var bombMaterial = new THREE.MeshLambertMaterial({ color: 0xfe0000 });
    var bomb = new THREE.Mesh(bombGeometry, bombMaterial);
    bomb.position.z = 2;

    var shooter = new THREE.Object3D();
    shooter.add(body);
    shooter.add(bomb);
    return shooter;
}

function animate() {
    updateForNextFrame();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

function updateForNextFrame() {
    subRotor.rotation.x += 0.08;
    var randomAdd = Math.floor(Math.random() * 11) - 5;
    submarine.position.x += randomAdd;
    if (submarine.position.x > 50) {
        submarine.position.x = 50;
    } else if (submarine.position.x < -50) {
        submarine.position.x = -50;
    }
}
