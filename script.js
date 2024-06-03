import * as THREE from "three";
import StaticComponents from "./staticComponents.js";
import { MouseClickActivity } from "./controls.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// import { CSS3DRenderer } from 'three/addons/renderers/CSS3DRenderer.js';
import { CSS2DRenderer } from "three/examples/jsm/Addons.js";
import { CSS2DObject } from "three/examples/jsm/Addons.js";

window.wallEditor = {};

// wallEditor.selectedEdgePoint = 1;
wallEditor.selectedLine = 1;
wallEditor.clickedLine = 1;

wallEditor.testing = {}

wallEditor.activateRemovePoint = false


wallEditor.latestMouseDownPosition = {};
wallEditor.subAreaLineId = 0;

wallEditor.spherePointer = 0;

const scene = new THREE.Scene();
wallEditor.aspect = window.innerWidth / window.innerHeight;

const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById("canvas"),
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor("white");

// const cssRenderer = new CSS2DRenderer();
// // cssRenderer.setSize(window.innerWidth, window.innerHeight);
// cssRenderer.setSize(800, 600);
// cssRenderer.domElement.style.position = "absolute";
// cssRenderer.domElement.style.top = 0;
// document.getElementById("canvas").appendChild(cssRenderer.domElement);

// wallEditor.cssRenderer = cssRenderer;

// // Create a label element
// const labelDiv = document.createElement("div");
// labelDiv.className = "label";
// labelDiv.textContent = `Area: 1168`;
// const label = new CSS2DObject(labelDiv);
// label.position.set(-0.5886833514689882, 0.4276387377584331, 0);

// scene.add(label);

const material = new THREE.MeshBasicMaterial({
  color: "red",
  wireframe: false,
  side: THREE.DoubleSide,
});
wallEditor.orthographicCamera = new THREE.OrthographicCamera(
  -wallEditor.aspect,
  wallEditor.aspect,
  1,
  -1,
  0.1,
  1000
);
wallEditor.orthographicCamera.position.z = 5;

wallEditor.perspectiveCamera = new THREE.PerspectiveCamera(
  45,
  wallEditor.aspect,
  0.1,
  1000
);
wallEditor.perspectiveCamera.position.z = 3;
wallEditor.tempActivator = false;
wallEditor.activateAddPoints = false;

wallEditor.startPointSubArea = null;

wallEditor.isWallConnected = false;
wallEditor.spaceBetweenLines = 1;
wallEditor.mousePoints = [];
wallEditor.isMouseDown = false;
wallEditor.isLineConnected = false;
wallEditor.previousEndPoints = [];
wallEditor.wallLines = [];
wallEditor.currentAlignment = "Center";
wallEditor.currentWallPattern = "solidFill";
wallEditor.color = "red";
wallEditor.is3DView = false;
wallEditor.linesArray = [];
wallEditor.currentWidth = parseFloat(
  document.getElementById("wallWidthRange").value
);
wallEditor.material = material;
wallEditor.renderer = renderer;
wallEditor.scene = scene;
wallEditor.camera = wallEditor.orthographicCamera;
wallEditor.lastMouseDownPosition = null;
wallEditor.temporaryLine = null;
wallEditor.temporaryOutline = null;
wallEditor.tempDotsGroup = new THREE.Group();
wallEditor.controls = new OrbitControls(
  wallEditor.camera,
  wallEditor.renderer.domElement
);
wallEditor.controls.enableRotate = false;
wallEditor.dotsGroup = new THREE.Group();
wallEditor.lineDots = {};
wallEditor.spherePosition = {};

wallEditor.isSubAreaActivated = false;
wallEditor.subAreaGroup = [];
wallEditor.subAreaGroupID = "0";
wallEditor.currSubAreaStartingPoint = null;
wallEditor.currSubAreaEndingPoint = null;
wallEditor.lastEndPoint = null;
wallEditor.isSubAreaCompleted = false;

wallEditor.subAreafirstLineDrawn = false;
wallEditor.allVerticesofSubArea = [];
wallEditor.wallType = null;

wallEditor.firstP1 = null;

wallEditor.subAreaOutlineMesh = [];
wallEditor.subAreaDotsGroups = null;
wallEditor.counter = 0;
// wallEditor.subAreaDotsGroups = []
// wallEditor.tempArr = []
const staticComponents = new StaticComponents();
const mouseClickActivity = new MouseClickActivity();
mouseClickActivity.addEventListeners();
staticComponents.animate();
