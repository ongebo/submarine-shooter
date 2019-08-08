var canvas; // The drawing surface.
var scene; // The root scene graph node.
var camera;
var renderer;

function init() {
    try {
        canvas = document.getElementById("viewport");
        scene = new THREE.Scene();
        buildWorld(); // Construct the application's scene graph.

        var cameraAspectRatio = canvas.width / canvas.height;
        camera = new THREE.PerspectiveCamera(45, cameraAspectRatio, 1, 1000);
        camera.position.z = 90;

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
    var subBody, subTop, subRotor;

    // Create the submarine's body.
    var subBodyGeometry = new THREE.SphereGeometry(10, 100, 100);
    var subBodyMaterial = new THREE.MeshLambertMaterial({ color: 0x000000 });
    subBody = new THREE.Mesh(subBodyGeometry, subBodyMaterial);
    subBody.scale.x = 4;

    // Create the submarine's top.
    var subTopGeometry = new THREE.BoxGeometry(10, 5, 7);
    var subTopMaterial = new THREE.MeshLambertMaterial({ color: 0x000000 });
    subTop = new THREE.Mesh(subTopGeometry, subTopMaterial);
    subTop.position.y = 10.5;

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

    // Create the submarine.
    var submarine = new THREE.Object3D();
    submarine.add(subBody);
    submarine.add(subTop);
    submarine.add(subRotor);

    scene.add(submarine);

    // Configure lighting for the scene.
    var light = new THREE.DirectionalLight();
    light.position.set(0, 0, 100);
    scene.add(light);
}

function animate() {
    var rotor = scene.children[0];
    rotor.rotation.y -= 0.01;
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}
