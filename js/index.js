var canvas; // The drawing surface.
var scene; // The root scene graph node.
var camera;
var renderer;

var submarine; // The submarine.
var subRotor; // The submarine's rotor.
var shooter; // The submarine shooter.

// Variables changed when exploding the submarine.
var submarineIsExploding;
var subBody;
var subBodyMaterial;
var subTower;
var subTowerMaterial;
var subTowerPositionY;
var explosionFrameNumber;

var bomb;
var bombIsDropping;
var bombPositionY;
var bombPositionZ;

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

        bombIsDropping = false;
        submarineIsExploding = false;
        explosionFrameNumber = 10;
        attachEventHandlers();
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
    subBodyMaterial = new THREE.MeshLambertMaterial({ color: 0x000000 });
    subBody = new THREE.Mesh(subBodyGeometry, subBodyMaterial);
    subBody.scale.x = 4;
    return subBody;
}

function createSubTower() {
    var subTowerGeometry = new THREE.BoxGeometry(10, 5, 7);
    subTowerMaterial = new THREE.MeshLambertMaterial({ color: 0x000000 });
    subTower = new THREE.Mesh(subTowerGeometry, subTowerMaterial);
    subTower.position.y = 10.5;
    subTowerPositionY = subTower.position.y;
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
    bomb = new THREE.Mesh(bombGeometry, bombMaterial);
    bomb.position.z = 2;

    shooter = new THREE.Object3D();
    shooter.add(body);
    shooter.add(bomb);
    return shooter;
}

function attachEventHandlers() {
    document.addEventListener("keydown", function(event) {
        if (bombIsDropping) {
            return;
        }
        switch (event.keyCode) {
            case 37: // Left arrow key.
                shooter.position.x -= 1;
                break;
            case 39: // Right arrow key.
                shooter.position.x += 1;
                break;
            case 40: // Down arrow key.
                bombPositionY = bomb.position.y;
                bombPositionZ = bomb.position.z;
                bombIsDropping = true;
                break;
        }
    });
}

function animate() {
    updateForNextFrame();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

function updateForNextFrame() {
    if (submarineIsExploding) {
        explodeSubmarine();
    } else {
        subRotor.rotation.x += 0.08;
        submarine.position.x -= 2;
        if (submarine.position.x < -100) {
            submarine.position.x = 100;
        }
    }

    if (bombIsDropping) {
        bomb.position.z++;
        if (collisionIsMade(bomb.position.z)) {
            submarineIsExploding = true;
            resetBomb();
        }
        if (bomb.position.z > 80) {
            resetBomb();
        }
    }
}

function collisionIsMade(bombHeight) {
    // Vertical and horizontal separations between centers of the bomb
    // and submarine for which collision is made.
    var collisionHeight = 45 - 0.6 - 8; // TODO: don't hardcode the calculation.
    var collisionWidth = 18;

    var bombPosition = new THREE.Vector3().setFromMatrixPosition(
        bomb.matrixWorld
    );
    var submarinePosition = new THREE.Vector3().setFromMatrixPosition(
        submarine.matrixWorld
    );

    var width = submarinePosition.x - bombPosition.x;
    var heightInRange =
        bombHeight >= collisionHeight && bombHeight <= collisionHeight + 8;
    var widthInRange = Math.abs(width) <= collisionWidth;
    return heightInRange && widthInRange;
}

function resetBomb() {
    bombIsDropping = false;
    bomb.position.y = bombPositionY;
    bomb.position.z = bombPositionZ;
}

function explodeSubmarine() {
    explosionFrameNumber += 10;
    if (explosionFrameNumber > 220) {
        submarineIsExploding = false;
        explosionFrameNumber = 10;
        subBody.material = subBodyMaterial;
        subTower.material = subTowerMaterial;
        subTower.position.y = subTowerPositionY;
        return;
    }
    subBody.material = new THREE.MeshPhongMaterial({
        color: new THREE.Color(explosionFrameNumber, 0, 0)
    });
    subTower.material = new THREE.MeshPhongMaterial({
        color: new THREE.Color(explosionFrameNumber, 0, 0)
    });
    subTower.position.y++;
}
