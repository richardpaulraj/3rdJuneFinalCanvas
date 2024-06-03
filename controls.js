//3 forloops with lines array
//1- corrected wall
// 2 - 3d toggle
// 3- 2d toggle
import * as THREE from "three";
import WallDrawer from "./wallDrawer.js";
import StaticComponents from "./staticComponents.js";
import TemporaryLine from "./tempLine.js";
import SubAreaDrawer from "./subAreaDrawer.js";
import { userData } from "three/examples/jsm/nodes/Nodes.js";

const wallDrawer = new WallDrawer();
const staticComponents = new StaticComponents();
const temporaryLine = new TemporaryLine();
const subAreaDrawer = new SubAreaDrawer();

class MouseClickActivity {
  constructor() {}

  toggleBtns3D() {
    document.getElementById("threeDToggleBtn").textContent =
      "Change to 2D View";
    document.getElementById("correctedWallTaskBtn").style.display = "block";
    document.getElementById("wallWidth").style.display = "none";
    document.getElementById("clearAllBtn").style.display = "none";
    document.getElementById("alignments").style.display = "none";
    document.getElementById("wallPatterns").style.display = "none";
    document.getElementById("colors").style.display = "none";
    document.getElementById("spaceBetweenLines").style.display = "none";
    document.getElementById("subAreaBtn").style.display = "none";
    document.getElementById("removePointsBtn").style.display = "none";
  }
  toggleBtns2D() {
    document.getElementById("threeDToggleBtn").textContent =
      "Change to 3D View";
    document.getElementById("correctedWallTaskBtn").style.display = "none";
    document.getElementById("wallWidth").style.display = "block";
    document.getElementById("clearAllBtn").style.display = "block";
    document.getElementById("alignments").style.display = "block";
    document.getElementById("wallPatterns").style.display = "block";
    document.getElementById("colors").style.display = "block";
    document.getElementById("spaceBetweenLines").style.display = "block";
    document.getElementById("subAreaBtn").style.display = "block";
    document.getElementById("removePointsBtn").style.display = "block";
  }

  onMouseDown(event) {
    // console.log('Add Points Activated : ',wallEditor.activateAddPoints);

    if (event.ctrlKey && wallEditor.activateAddPoints) {
      // const mouse = new THREE.Vector2();

      // mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      // mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      // /////////////////////////////////TEsting

      // function distanceToLine(point, line1, line2) {
      //   const lineDirection = new THREE.Vector3().subVectors(line2, line1);
      //   const lineLength = lineDirection.length();
      //   lineDirection.normalize();

      //   const pointToLine1 = new THREE.Vector3().subVectors(point, line1);
      //   const projectedDistance = pointToLine1.dot(lineDirection);

      //   if (projectedDistance < 0) {
      //     return pointToLine1.length();
      //   } else if (projectedDistance > lineLength) {
      //     const pointToLine2 = new THREE.Vector3().subVectors(point, line2);
      //     return pointToLine2.length();
      //   } else {
      //     const projectedPoint = new THREE.Vector3()
      //       .copy(lineDirection)
      //       .multiplyScalar(projectedDistance)
      //       .add(line1);
      //     return point.distanceTo(projectedPoint);
      //   }
      // }

      // const mouseWorldPosition = new THREE.Vector3(mouse.x, mouse.y, 0.5);
      // mouseWorldPosition.unproject(wallEditor.camera);

      // let minDistance = Infinity;
      // let clickedLine = null;

      // // Iterate over all lines in the scene
      // for (const child of wallEditor.scene.children) {
      //   if (child.geometry && child.geometry.userData.lineId !== undefined) {
      //     const lineGeometry = child.geometry;
      //     const linePositions = lineGeometry.getAttribute("position").array;

      //     // Iterate over line segments
      //     for (let i = 0; i < linePositions.length - 3; i += 3) {
      //       const start = new THREE.Vector3(
      //         linePositions[i],
      //         linePositions[i + 1],
      //         linePositions[i + 2]
      //       );
      //       const end = new THREE.Vector3(
      //         linePositions[i + 3],
      //         linePositions[i + 4],
      //         linePositions[i + 5]
      //       );

      //       const distance = distanceToLine(mouseWorldPosition, start, end);

      //       if (distance < minDistance) {
      //         minDistance = distance;
      //         clickedLine = lineGeometry.userData.lineId;
      //       }
      //     }
      //   }
      // }

      // if (clickedLine !== null) {
      //   console.log(`Line Number Selected: ${clickedLine - 1}`);
      //   wallEditor.clickedLine = clickedLine - 1;
      // }
      // ////////////////////////Testing

      subAreaDrawer.addPoints(event);
    }

    wallEditor.isMouseDown = true;

    temporaryLine.handleTemporaryLine(event);

    wallEditor.lastMouseDownPosition = { x: event.clientX, y: event.clientY };

    if (wallEditor.isSubAreaActivated) {
      wallEditor.wallType = "subArea";
    } else {
      wallEditor.wallType = "wall";
    }

    // this.selectingSubArea('mousemove')

    // this.selectingSubArea('click')//uncomment it afterwards

    if (!event.ctrlKey) {
      subAreaDrawer.selectingSubArea("click");
    }
  }

  onMouseMove(event) {
    if (wallEditor.isSubAreaActivated && wallEditor.subAreafirstLineDrawn) {
      subAreaDrawer.subAreaTempLine(event);
    }

    if (event.ctrlKey && !wallEditor.activateAddPoints) {
      subAreaDrawer.stretchSubArea(event);
    }
  }

  onMouseUp(event) {
    ////////////////////////////////////////////////////////

    // console.log(wallEditor.tempDotsGroup)
    wallEditor.isMouseDown = false;

    if (!wallEditor.isMouseDown) {
    }

    if (wallEditor.isSubAreaActivated) {
      wallEditor.wallType = "subArea";
    } else {
      wallEditor.wallType = "wall";
    }

    // Check if the mouse has moved between mousedown and mouseup
    if (
      !wallEditor.is3DView &&
      wallEditor.lastMouseDownPosition &&
      (wallEditor.lastMouseDownPosition.x !== event.clientX ||
        wallEditor.lastMouseDownPosition.y !== event.clientY)
    ) {
      // Call addPoint only if the mouse has moved
      this.update(event);
      wallEditor.mousePoints.length = 0;
    }

    // Check if the mouse has moved between mousedown and mouseup
    else if (!wallEditor.is3DView && wallEditor.isSubAreaActivated) {
      // Call addPoint only if the SubAreaActivated
      this.update(event);
      wallEditor.mousePoints.length = 0;
    }

    // Reset the last mouse down position
    wallEditor.lastMouseDownPosition = null;
    temporaryLine.clearTemporaryLine();
    temporaryLine.clearTemporaryOutline();
    temporaryLine.clearTempDots();

    wallEditor.mousePoints.length = 0;
  }

  update(event) {
    const mouse = new THREE.Vector2(
      (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, wallEditor.camera);
    const intersection = new THREE.Vector3();
    raycaster.ray.intersectPlane(
      new THREE.Plane(
        new THREE.Vector3(0, 0, 1).applyMatrix4(wallEditor.camera.matrixWorld),
        0
      ),
      intersection
    );

    if (wallEditor.mousePoints.length === 0) {
      //   this.createTemporaryPoint(intersection)
      wallEditor.mousePoints.push(intersection);
    } else {
      temporaryLine.clearTemporaryLine();
      temporaryLine.clearTemporaryOutline();

      temporaryLine.clearTempDots();
      temporaryLine.createTemporaryLine(
        wallEditor.mousePoints[wallEditor.mousePoints.length - 1],
        intersection
      );

      temporaryLine.createTemporaryLine(
        wallEditor.mousePoints[wallEditor.mousePoints.length - 1],
        intersection
      );
    }

    wallEditor.mousePoints.push(intersection);

    if (wallEditor.mousePoints.length >= 2 && !wallEditor.is3DView) {
      staticComponents.addLineData();
      const latestLine =
        wallEditor.linesArray[wallEditor.linesArray.length - 1];
      wallDrawer.draw2DWall(latestLine);
    }
  }

  addEventListeners() {
    if (!wallEditor.is3DView) {
      document.addEventListener("mousemove", (event) =>
        temporaryLine.handleTemporaryLine(event)
      );
      document.addEventListener("mousedown", this.onMouseDown.bind(this));
      document.addEventListener("mouseup", this.onMouseUp.bind(this));
      document.addEventListener("mousemove", this.onMouseMove.bind(this));
    }
    document.getElementById("threeDToggleBtn").addEventListener("click", () => {
      this.switchTo3DView();
    });

    document
      .getElementById("correctedWallTaskBtn")
      .addEventListener("click", () => {
        if (wallEditor.is3DView) {
          staticComponents.clearScene(wallEditor.scene);
          wallEditor.linesArray.forEach((line) =>
            //wallDrawer.correctedWallIn3DView(line)
            wallDrawer.correctedWallIn3DView(line)
          );
        }
      });

    document
      .getElementById("wallWidthRange")
      .addEventListener("input", (event) => {
        wallEditor.currentWidth = parseFloat(event.target.value);
      });

    document.getElementById("clearAllBtn").addEventListener("click", () => {
      if (!wallEditor.is3DView) {
        wallEditor.linesArray.length = 0;
        staticComponents.clearScene(wallEditor.scene);
      }
    });

    document
      .querySelectorAll('input[name="alignmentsRadioBtn"]')
      .forEach((radioBtn) => {
        radioBtn.addEventListener("change", (e) => {
          wallEditor.currentAlignment = e.target.value;
          console.log("Selected alignment:", wallEditor.currentAlignment);
        });
      });
    document
      .querySelectorAll('input[name="wallPatternRadioBtn"]')
      .forEach((radioBtn) => {
        radioBtn.addEventListener("change", (e) => {
          wallEditor.currentWallPattern = e.target.value;
        });
      });
    document
      .querySelectorAll('input[name="colorRadioBtn"]')
      .forEach((radioBtn) => {
        radioBtn.addEventListener("change", (e) => {
          wallEditor.color = e.target.value;
          // console.log('Selected color:', wallEditor.color)
        });
      });

    document
      .getElementById("spaceBetweenLinesRange")
      .addEventListener("input", (event) => {
        wallEditor.spaceBetweenLines = parseInt(event.target.value);
        // console.log(wallEditor.spaceBetweenLines)
      });

    // document
    //   .getElementById("edgePoint")
    //   .addEventListener("change", function (event) {
    //     if (event.target && event.target.matches('input[name="edges"]')) {
    //       const selectedEdge = document.querySelector(
    //         'input[name="edges"]:checked'
    //       );
    //       if (selectedEdge) {
    //         wallEditor.selectedLine = selectedEdge.value;
    //         console.log("Selected Line:", wallEditor.selectedLine);
    //       }
    //     }
    //   });

    document.getElementById("addPoints").addEventListener("click", () => {
      wallEditor.activateAddPoints = !wallEditor.activateAddPoints;
      console.log("Adding Points", wallEditor.activateAddPoints);
    });

    document
      .getElementById("removePointsBtn")
      .addEventListener("click", (event) => {
        wallEditor.activateRemovePoint = !wallEditor.activateRemovePoint;
        console.log("Remove Activated : ", wallEditor.activateRemovePoint);
        // subAreaDrawer.removePointBtn(event);
      });
    // document.getElementById("tempBtn").addEventListener("click", (event) => {
    //   console.log("temp clicked");
    //   function findCenterOfPolygon() {
    //     let vertices = wallEditor.spherePosition[1];
    //     // Initialize sums
    //     let sumX = 0;
    //     let sumY = 0;

    //     // Calculate sums
    //     for (const vertex of vertices) {
    //       sumX += vertex.x;
    //       sumY += vertex.y;
    //       console.log(sumX, sumY);
    //     }

    //     // Calculate averages
    //     const avgX = sumX / vertices.length;
    //     const avgY = sumY / vertices.length;

    //     // Return center coordinates
    //     return { x: avgX, y: avgY };
    //   }

    //   function calculatePolygonArea() {
    //     // let vertices = wallEditor.spherePosition[1].map((v) => ({
    //     //   x: ((v.x + 1) / 2) * window.innerWidth,
    //     //   y: ((-v.y + 1) / 2) * window.innerHeight,
    //     // }));
    //     let vertices = wallEditor.spherePosition[1]
    //     let area = 0;
    //     const numVertices = vertices.length;

    //     for (let i = 0; i < numVertices; i++) {
    //       const j = (i + 1) % numVertices;
    //       area += vertices[i].x * vertices[j].y;
    //       area -= vertices[i].y * vertices[j].x;
    //     }

    //     return Math.abs(area) / 2;
    //   }

    //   const center = findCenterOfPolygon();
    //   const area = calculatePolygonArea();

    //   console.log("Center of the polygon:", center);
    //   console.log(`The area of the polygon is: ${area}`);

    //   //////////

    //   const sphereGeometry = new THREE.SphereGeometry(0.01, 32, 32);
    //   const sphereMaterial = new THREE.MeshBasicMaterial({
    //     color: "#9BCF53",
    //   });

    //   const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    //   sphere.position.set(center.x, center.y, 0);

    //   wallEditor.scene.add(sphere);
    //   ////////

    //   // // To toggle visibility for a specific line's dots
    //   // const lineId = wallEditor.subAreaGroupID;
    //   // // const lineId = '1';
    //   // let lineId = wallEditor.subAreaGroupID;

    //   // console.log(lineId);
    //   // // console.log(lineId2)

    //   // if (wallEditor.lineDots[lineId]) {
    //   //   wallEditor.lineDots[lineId].forEach((dot) => {
    //   //     dot.visible = !dot.visible;
    //   //   });
    //   // }

    //   ////////
    //   ////////
    // });
    document.getElementById("subAreaBtn").addEventListener("click", () => {
      wallEditor.wallType = "subArea";
      wallEditor.isSubAreaActivated = !wallEditor.isSubAreaActivated;
      wallEditor.isSubAreaCompleted = false;
      wallEditor.subAreafirstLineDrawn = false;
      wallEditor.firstNewP1 = null;
      wallEditor.lastEndPoint = null;

      // console.log(wallEditor.subAreaGroupID);
      // if(wallEditor.subAreaGroupID === "1"){
      //   console.log('x')
      // }
      //   else{
      //     wallEditor.subAreaGroupID = `${parseInt(wallEditor.subAreaGroupID) + 1}`;
      //   }

      wallEditor.subAreaGroupID = `${parseInt(wallEditor.subAreaGroupID) + 1}`;

      // console.log(wallEditor.subAreaGroupID);

      const lineId = wallEditor.subAreaGroupID;
      if (wallEditor.lineDots[lineId]) {
        wallEditor.lineDots[lineId].forEach((dot) => {
          dot.visible = !dot.visible;
        });
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" || event.key === "Esc") {
        wallEditor.scene.remove(wallEditor.subAreaTempLine); //to remove the temp line
        if (wallEditor.isSubAreaActivated) {
          if (!wallEditor.isSubAreaCompleted) {
            alert(
              "Lines are not completed. The current Sub Area group will be deleted."
            );

            subAreaDrawer.removeMeshAndDotsBySubAreaGroupId(
              wallEditor.subAreaGroupID
            );

            if (wallEditor.lineDots[wallEditor.subAreaGroupID]) {
              wallEditor.lineDots[wallEditor.subAreaGroupID].forEach((dot) => {
                console.log("turing visiblity off for the dots");
                dot.visible = false;
              });
            }

            // wallEditor.subAreaGroupID = `${
            //   parseInt(wallEditor.subAreaGroupID) + 1
            // }`; //uncomment afterwards dont know why it is there
          }

          wallEditor.isSubAreaActivated = false;
          wallEditor.subAreafirstLineDrawn = false;
          wallEditor.firstNewP1 = null;
          wallEditor.lastEndPoint = null;
          console.log(wallEditor.lineDots);
        }
      }
    });
  }

  switchTo3DView() {
    if (wallEditor.is3DView) {
      // staticComponents.clearScene(wallEditor.scene)

      wallEditor.camera = wallEditor.orthographicCamera;
      wallEditor.controls.object = wallEditor.camera; //this updates the orbit control with the new camera
      wallEditor.controls.enableRotate = false;
      wallEditor.dotsGroup.visible = false;
      wallEditor.linesArray.forEach((line) => wallDrawer.draw2DWall(line));
      this.toggleBtns2D();

      // Hide the dots in 3D view
    } else {
      if (wallEditor.linesArray.length === 0) {
        alert("Draw something to see in 3D View");
        return;
      }
      wallEditor.camera = wallEditor.perspectiveCamera;
      wallEditor.controls.object = wallEditor.camera;
      wallEditor.controls.enableRotate = true;

      // Hide the dots in 3D view
      wallEditor.dotsGroup.visible = false;
      wallEditor.linesArray.forEach((line) => wallDrawer.draw3DWall(line));
      this.toggleBtns3D();
    }

    wallEditor.is3DView = !wallEditor.is3DView;
  }
}

export { MouseClickActivity };
