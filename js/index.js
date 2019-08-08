var canvas; // The drawing surface.

var scene;
var camera;
var renderer;

function init() {
    try {
        canvas = document.getElementById("viewport");
        scene = new THREE.Scene();
        renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });

        var cameraAspect = canvas.width / canvas.height;
        camera = new THREE.PerspectiveCamera(50, cameraAspect, 1, 1000);
    } catch (e) {
        var errorOutput = document.getElementById("error-message");
        errorOutput.innerHTML = "<h1>Enable WebGL to continue.</h1>";
        return;
    }
}
