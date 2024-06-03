//1 forloop
import * as THREE from "three";

import StaticComponents from "./staticComponents.js";

const staticComponents = new StaticComponents();

class SubAreaDrawer {
  constructor() {}
  temp() {
    console.log("Working________________________-");
  }

  drawSubArea(line) {
    if (wallEditor.isSubAreaActivated) {
      let newP1 = new THREE.Vector3().copy(line.start);
      let newP2 = new THREE.Vector3().copy(line.end);

      const snapDistance = 0.07;

      if (!wallEditor.firstNewP1) {
        wallEditor.firstNewP1 = new THREE.Vector3().copy(newP1); // Store the first starting point
      }

      if (wallEditor.lastEndPoint) {
        newP1.copy(wallEditor.lastEndPoint);
      }

      wallEditor.lastEndPoint = newP2.clone();

      // const cornerPoints = [{ x: newP2.x, y: newP2.y }]; //Generally it draws 2 points staring point and ending point we only wanted the ending point to draw dots
      // const outlineVertices = [newP1.x, newP1.y, 0, newP2.x, newP2.y, 0];

      // wallEditor.allVerticesofSubArea.push(newP2.x, newP2.y, 0);

      ////////////////////////////////////////////////////now changes///////////////////////////
      // console.log(wallEditor.subAreaGroupID)

      if (wallEditor.subAreafirstLineDrawn) {
        const distanceToStart = newP2.distanceTo(wallEditor.firstNewP1);
        // console.log(wallEditor.subAreaGroupID)
        if (distanceToStart < snapDistance) {
          wallEditor.linesArray[wallEditor.linesArray.length - 1].start =
            wallEditor.firstNewP1; //doing this because of snapping point the the starting point dosent change the values in the values array
          wallEditor.linesArray[wallEditor.linesArray.length - 1].end =
            wallEditor.firstNewP1;

          wallEditor.isSubAreaCompleted = true;

          // console.log(wallEditor.spherePosition);

          const cornerPoints =
            wallEditor.spherePosition[wallEditor.subAreaGroupID];
          const shape = new THREE.Shape();

          shape.moveTo(cornerPoints[0].x, cornerPoints[0].y); // Move to the starting point

          for (let i = 1; i < cornerPoints.length; i++) {
            const point = cornerPoints[i];
            shape.lineTo(point.x, point.y);
          }

          // Close the shape by drawing a line from the last point to the starting point
          shape.lineTo(cornerPoints[0].x, cornerPoints[0].y);

          const geometry = new THREE.ShapeGeometry(shape);
          const material = new THREE.MeshBasicMaterial({
            color: line.color,
            side: THREE.DoubleSide,
          });

          geometry.userData.id = wallEditor.subAreaGroupID;

          const mesh = new THREE.Mesh(geometry, material);
          mesh.userData.id = wallEditor.subAreaGroupID;

          mesh.addEventListener("click", () => {
            console.log("Mesh clicked:", mesh.geometry.userData.id);
          });

          mesh.addEventListener("mouseover", () => {
            // console.log("Mesh hovered:", mesh.geometry.userData.id);
          });

          wallEditor.scene.add(mesh);

          // console.log(mesh);

          wallEditor.allVerticesofSubArea = [];
          newP2.copy(wallEditor.firstNewP1);
          wallEditor.isSubAreaActivated = false;
          wallEditor.lastEndPoint = null;
          wallEditor.firstNewP1 = null; // Reset firstNewP1
          wallEditor.subAreafirstLineDrawn = false;

          // console.log("before points");
          // console.log(wallEditor.spherePosition[1]);

          if (wallEditor.subAreaTempLine) {
            //when it snaps the last temp line was visible so did this
            wallEditor.scene.remove(wallEditor.subAreaTempLine);
          }
        }
      } else {
        wallEditor.subAreafirstLineDrawn = true;
      }

      const cornerPoints = [{ x: newP2.x, y: newP2.y }];

      // Store each sphere position in the spherePosition object
      if (!wallEditor.spherePosition[wallEditor.subAreaGroupID]) {
        wallEditor.spherePosition[wallEditor.subAreaGroupID] = [];
      }
      wallEditor.spherePosition[wallEditor.subAreaGroupID].push(
        ...cornerPoints
      );

      // console.log(wallEditor.spherePosition);

      // console.log(cornerPoints)
      // console.log(wallEditor.lineDots)
      const outlineVertices = [newP1.x, newP1.y, 0, newP2.x, newP2.y, 0];

      // wallEditor.allVerticesofSubArea.push(newP2.x, newP2.y, 0);

      const outlineGeometry = new THREE.BufferGeometry();
      outlineGeometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(outlineVertices, 3)
      );

      // outlineGeometry.userData.id = wallEditor.subAreaGroupID;
      // console.log(wallEditor.subAreaGroupID)

      // if(wallEditor.isSubAreaCompleted){
      //   outlineGeometry.userData.id = (wallEditor.subAreaGroupID - 1).toString();
      // }else{
      outlineGeometry.userData.id = wallEditor.subAreaGroupID;
      wallEditor.subAreaLineId = wallEditor.subAreaLineId + 1;
      outlineGeometry.userData.lineId = wallEditor.subAreaLineId - 1; ////////////

      // }
      // console.log(wallEditor.subAreaGroupID);

      const outlineMaterial = new THREE.LineBasicMaterial({
        color: line.color,
        // color:'gold'
      });
      const outlineMesh = new THREE.LineSegments(
        outlineGeometry,
        outlineMaterial
      );
      outlineMesh.userData.id = wallEditor.subAreaGroupID;
      // outlineMesh.userData.lineId = wallEditor.subAreaLineId++

      // Add corner points as spheres
      const sphereGeometry = new THREE.SphereGeometry(0.01, 32, 32);
      sphereGeometry.userData.id = wallEditor.subAreaGroupID;

      const sphereMaterial = new THREE.MeshBasicMaterial({
        color: "#9BCF53",
      });

      // Create a group to hold the spheres
      // [...cornerPoints].forEach((point) => {

      for (let i = 0; i < [...cornerPoints].length; i++) {
        let point = [...cornerPoints][i];

        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sphere.position.set(point.x, point.y, 0);
        sphere.userData.id = wallEditor.subAreaGroupID;
        wallEditor.spherePointer = wallEditor.spherePointer + 1;
        sphere.userData.sphereId = wallEditor.spherePointer;
        wallEditor.dotsGroup.add(sphere);

        // Store each sphere in the lineDots object
        if (!wallEditor.lineDots[wallEditor.subAreaGroupID]) {
          wallEditor.lineDots[wallEditor.subAreaGroupID] = [];
        }
        wallEditor.lineDots[wallEditor.subAreaGroupID].push(sphere);
      }

      // console.log(wallEditor.lineDots)

      wallEditor.scene.add(wallEditor.dotsGroup); // Add the dotsGroup to the scene

      wallEditor.subAreaOutlineMesh = outlineMesh;
      if (wallEditor.isSubAreaCompleted) {
        wallEditor.dotsGroup.children.pop();
        // console.log(wallEditor.dotsGroup.children);

        if (wallEditor.lineDots[wallEditor.subAreaGroupID]) {
          wallEditor.lineDots[wallEditor.subAreaGroupID].forEach((dot) => {
            dot.visible = !dot.visible;
          });
        }
      }

      wallEditor.scene.add(wallEditor.subAreaOutlineMesh);
      // wallEditor.scene.add(outlineMesh);

      // console.log(wallEditor.scene.children);

      // console.log(wallEditor.linesArray[wallEditor.linesArray.length-1])
    }
  }
  selectingSubArea(activity) {
    // Create a Set to store the processed mesh IDs
    const processedMeshIds = new Set();

    // Create a raycaster object
    const raycaster = new THREE.Raycaster();

    // Create a mouse vector to store the mouse position
    const mouse = new THREE.Vector2();

    // Add an event listener for mouse clicks
    const clickHandler = (event) => {
      // Calculate the mouse position in normalized device coordinates
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      // Cast a ray from the mouse position
      raycaster.setFromCamera(mouse, wallEditor.camera);

      // Get the list of intersected objects
      const intersects = raycaster.intersectObjects(
        wallEditor.scene.children,
        true
      );

      // let minDistance = Infinity;
      // let clickedLine = null;

      // if (intersects.length > 0) {
      //   for (const intersect of intersects) {
      //     if (intersect.object.geometry.userData.lineId !== undefined) {
      //       console.log(`

      //       `);
      //       console.log(
      //         "Line Number Selected: ",
      //         intersect.object.geometry.userData.lineId
      //       );
      //       break;
      //     }
      //   }
      // }
      // if (intersects.length > 0) {
      //   for (const intersect of intersects) {
      //     if (intersect.object.geometry.userData.lineId !== undefined) {
      //       const linePosition = intersect.object.position.clone();
      //       const distanceToLine = linePosition.distanceTo(raycaster.ray.origin);

      //       if (distanceToLine < minDistance) {
      //         minDistance = distanceToLine;
      //         clickedLine = intersect.object.geometry.userData.lineId;
      //       }
      //     }
      //   }

      //   if (clickedLine !== null) {
      //     console.log(`Line Number Selected: ${clickedLine}`);
      //   }
      // }

      let previousSelectedDot = null;

      // Check if any meshes were intersected
      if (intersects.length > 0) {
        // Initialize all dots to green when creating the dots
        for (const dot of wallEditor.dotsGroup.children) {
          dot.material.color.set("lightgreen");
        } //////////

        for (const intersect of intersects) {
          if (intersect.object.userData.sphereId) {
            console.log(
              "Edge Point Selected : ",
              intersect.object.userData.sphereId
            );

            //Remove Points Functionality
            if (wallEditor.activateRemovePoint) {
              this.removePointBtn(intersect.object.userData.sphereId);
            }

            wallEditor.selectedEdgePoint = intersect.object.userData.sphereId;

            // Reset the color of the previously selected dot
            if (previousSelectedDot) {
              previousSelectedDot.material.color.set("lightgreen"); // Replace 'originalColor' with the actual original color
            }

            // Change the color of the selected dot
            const selectedDot =
              wallEditor.dotsGroup.children[wallEditor.selectedEdgePoint - 1];
            if (
              selectedDot &&
              selectedDot.material &&
              selectedDot.material.color
            ) {
              selectedDot.material.color.set("green");
              previousSelectedDot = selectedDot; // Update the previous selected dot
            }
          }

          if (intersect.object.isMesh && !intersect.object.userData.sphereId) {
            /////////////////////

            // Change the color of the selected dot
            const selectedDot =
              wallEditor.dotsGroup.children[wallEditor.selectedEdgePoint - 1];
            if (
              selectedDot &&
              selectedDot.material &&
              selectedDot.material.color
            ) {
              selectedDot.material.color.set("green");
              previousSelectedDot = selectedDot; // Update the previous selected dot
            }

            /////////////////////

            // console.log(intersect.object)

            const intersectedMesh = intersect.object;

            // Check if the intersected object has a userData.id property
            if (intersectedMesh.geometry.userData.id !== undefined) {
              const meshID = intersectedMesh.geometry.userData.id;
              // Check if the mesh ID has already been processed
              if (!processedMeshIds.has(meshID)) {
                console.log("Mesh clicked:", meshID);

                for (const intersect of intersects) {
                  if (intersect.object.isLineSegments) {
                    if (intersect.object.geometry.userData.id === meshID) {
                      // Check the current color state of the line
                      if (
                        !intersect.object.userData.color ||
                        intersect.object.userData.color === "red"
                      ) {
                        // Create a new material with blue color
                        const newMaterial = intersect.object.material.clone();
                        newMaterial.color.set(0x0000ff);
                        intersect.object.material = newMaterial;
                        // Update the color state of the line to blue
                        intersect.object.userData.color = "blue";
                      } else {
                        // Create a new material with red color
                        const newMaterial = intersect.object.material.clone();
                        newMaterial.color.set(0xff0000);
                        intersect.object.material = newMaterial;
                        // Update the color state of the line to red
                        intersect.object.userData.color = "red";
                      }
                    }
                  }
                }

                // for (const newIntersect of intersects) {
                //   if(newIntersect.object.isLineSegments){
                //     // newIntersect.object.material.color.set('blue')
                //     // console.log(intersectedMesh.material.color.getHex())
                //     if(intersectedMesh.material.color.getHex() === 0xff0000){
                //       // newIntersect.object.material.color = newIntersect.object.material.color.getHex() === 0x0000ff ? 0xff0000 : 0x0000ff   //blue
                //       newIntersect.object.material.color = 0x0000ff
                //     }

                //   }
                // }

                // wallEditor.linesArray.forEach((each)=>{
                //   if(each.subAreaGroupID === '1'){
                //     let newEach = each
                //     if(each.subAreaOutlineMesh){
                //       console.log(newEach)

                //     console.log(newEach.subAreaOutlineMesh.material.color = 0xff0000)
                //   }}
                // })
                // Iterate over each line in wallEditor.linesArray

                // wallEditor.linesArray.forEach((each) => {
                //   // Check if the line has a subAreaGroupID of '1'
                //   if (each.subAreaGroupID === '2') {
                //       // Check if the line has a subAreaOutlineMesh
                //       if (each.subAreaOutlineMesh) {
                //           // Create a copy of the material to avoid modifying the original material
                //           const newMaterial = each.subAreaOutlineMesh.material.clone();
                //           // Set the color of the new material to red (0xff0000)
                //           newMaterial.color.set(0x0000ff);
                //           // Assign the new material to the subAreaOutlineMesh
                //           each.subAreaOutlineMesh.material = newMaterial;
                //       }
                //   }
                // });

                // Iterate over each line in wallEditor.linesArray
                /////////////////////////////////////////////
                // wallEditor.linesArray.forEach((each) => {
                //   // Check if the line has a subAreaGroupID of '1'
                //   if (each.subAreaGroupID === meshID) {
                //       // Check if the line has a subAreaOutlineMesh
                //       if (each.subAreaOutlineMesh) {
                //           // Check the current color of the line
                //           if (each.color === 'red') {
                //               // Create a copy of the material to avoid modifying the original material
                //               const newMaterial = each.subAreaOutlineMesh.material.clone();
                //               // Set the color of the new material to blue (0x0000ff)
                //               newMaterial.color.set(0x0000ff);
                //               // Assign the new material to the subAreaOutlineMesh
                //               each.subAreaOutlineMesh.material = newMaterial;
                //               // Update the color state of the line
                //               each.color = 'blue';
                //           } else {
                //               // Create a copy of the material to avoid modifying the original material
                //               const newMaterial = each.subAreaOutlineMesh.material.clone();
                //               // Set the color of the new material back to red (0xff0000)
                //               newMaterial.color.set(0xff0000);
                //               // Assign the new material to the subAreaOutlineMesh
                //               each.subAreaOutlineMesh.material = newMaterial;
                //               // Update the color state of the line
                //               each.color = 'red';
                //           }
                //       }
                //   }
                // });
                ////////////////////////////////////////////////////////////////////

                this.toggleDots(meshID);

                processedMeshIds.add(meshID); // Add the mesh ID to the processed set

                // if (event.ctrlKey) {
                //   this.toggleDots(meshID)
                // }

                wallEditor.renderer.domElement.removeEventListener(
                  activity,
                  clickHandler
                );
              }
            }
          }
        }
      }
    };

    wallEditor.renderer.domElement.addEventListener(activity, clickHandler);
  }

  toggleDots(meshID) {
    if (wallEditor.lineDots[meshID]) {
      wallEditor.lineDots[meshID].forEach((dot) => {
        dot.visible = !dot.visible;
      });
    }

    // console.log(wallEditor.lineDots);
  }

  getIntersectionPoint(event) {
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
    return intersection;
  }

  addPoints(event) {
    if (wallEditor.activateAddPoints) {
      //////
      const processedMeshIds = new Set();

      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();

      // Add an event listener for mouse clicks
      const clickHandler = (event) => {
        // Calculate the mouse position in normalized device coordinates
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        /////////////////////////////////

        function distanceToLine(point, line1, line2) {
          const lineDirection = new THREE.Vector3().subVectors(line2, line1);
          const lineLength = lineDirection.length();
          lineDirection.normalize();

          const pointToLine1 = new THREE.Vector3().subVectors(point, line1);
          const projectedDistance = pointToLine1.dot(lineDirection);

          if (projectedDistance < 0) {
            return pointToLine1.length();
          } else if (projectedDistance > lineLength) {
            const pointToLine2 = new THREE.Vector3().subVectors(point, line2);
            return pointToLine2.length();
          } else {
            const projectedPoint = new THREE.Vector3()
              .copy(lineDirection)
              .multiplyScalar(projectedDistance)
              .add(line1);
            return point.distanceTo(projectedPoint);
          }
        }

        const mouseWorldPosition = new THREE.Vector3(mouse.x, mouse.y, 0.5);
        mouseWorldPosition.unproject(wallEditor.camera);

        let minDistance = Infinity;
        let clickedLine = null;

        // Iterate over all lines in the scene
        for (const child of wallEditor.scene.children) {
          if (child.geometry && child.geometry.userData.lineId !== undefined) {
            const lineGeometry = child.geometry;
            const linePositions = lineGeometry.getAttribute("position").array;

            // Iterate over line segments
            for (let i = 0; i < linePositions.length - 3; i += 3) {
              const start = new THREE.Vector3(
                linePositions[i],
                linePositions[i + 1],
                linePositions[i + 2]
              );
              const end = new THREE.Vector3(
                linePositions[i + 3],
                linePositions[i + 4],
                linePositions[i + 5]
              );

              const distance = distanceToLine(mouseWorldPosition, start, end);

              if (distance < minDistance) {
                minDistance = distance;
                clickedLine = lineGeometry.userData.lineId;
              }
            }
          }
        }

        if (clickedLine !== null) {
          console.log(`Line Number Selected: ${clickedLine}`);
          wallEditor.clickedLine = clickedLine;
        }
        ////////////////////////

        // Cast a ray from the mouse position
        raycaster.setFromCamera(mouse, wallEditor.camera);

        // Get the list of intersected objects
        const intersects = raycaster.intersectObjects(
          wallEditor.scene.children,
          true
        );

        if (intersects.length > 0 && true) {
          for (const intersect of intersects) {
            ////////////////////////////
            if (intersect.object.isMesh) {
              const intersectedMesh = intersect.object;
              if (intersectedMesh.geometry.userData.id !== undefined) {
                const meshID = intersectedMesh.geometry.userData.id;
                // Check if the mesh ID has already been processed
                if (!processedMeshIds.has(meshID)) {
                  console.log("Mesh clicked add Points", meshID);
                  ///////////////////////////
                  let intersectionPoint = this.getIntersectionPoint(event);

                  wallEditor.testing.x = intersectionPoint.x;
                  wallEditor.testing.y = intersectionPoint.y;

                  //////////////////////////
                  wallEditor.activateAddPoints = false;

                  wallEditor.renderer.domElement.removeEventListener(
                    "click",
                    clickHandler
                  );
                  ///////////////////////////////////////
                  ////////////////new

                  staticComponents.clearScene(wallEditor.scene);

                  // wallEditor.scene.children.forEach((child) => {
                  //   if (child.userData.id === wallEditor.subAreaGroupID) {
                  //     wallEditor.scene.remove(child);
                  //   }
                  // });

                  // console.log(wallEditor.testing);
                  let points = wallEditor.spherePosition[1];
                  // console.log(points);
                  wallEditor.spherePosition[1].splice(
                    wallEditor.clickedLine,
                    0,
                    wallEditor.testing
                  );
                  // console.log(wallEditor.spherePosition[1]);

                  const outlinePoints = [];
                  const shape = new THREE.Shape();

                  shape.moveTo(points[0].x, points[0].y); // Move to the starting point

                  //setting the closing point to the strting point
                  wallEditor.spherePosition[1][
                    wallEditor.spherePosition[1].length - 1
                  ] = wallEditor.spherePosition[1][0];

                  for (let i = 0; i < points.length; i++) {
                    shape.lineTo(points[i].x, points[i].y);
                    outlinePoints.push(
                      new THREE.Vector3(points[i].x, points[i].y, 0)
                    );
                  }

                  // Close the shape by drawing a line from the last point to the starting point
                  shape.lineTo(points[0].x, points[0].y);

                  let tempSpherePointer = 0;

                  const sphereGeometry = new THREE.SphereGeometry(0.01, 32, 32);
                  //  sphereGeometry.userData.id = wallEditor.subAreaGroupID;

                  const sphereMaterial = new THREE.MeshBasicMaterial({
                    color: "#9BCF53",
                  });

                  [...points].forEach((point) => {
                    const sphere = new THREE.Mesh(
                      sphereGeometry,
                      sphereMaterial
                    );
                    sphere.position.set(point.x, point.y, 0);
                    sphere.userData.id = wallEditor.subAreaGroupID;

                    tempSpherePointer = tempSpherePointer + 1;
                    sphere.userData.sphereId = tempSpherePointer;

                    wallEditor.dotsGroup.add(sphere);
                    wallEditor.scene.add(wallEditor.dotsGroup);

                    if (wallEditor.lineDots[wallEditor.subAreaGroupID]) {
                      wallEditor.lineDots[wallEditor.subAreaGroupID] = [];
                      wallEditor.lineDots[wallEditor.subAreaGroupID].push(
                        sphere
                      );
                    }
                  });
                  ///////////////////////////////
                  this.updateLinesAgain(outlinePoints);
                  this.removeDuplicateLineIds();

                  const geometry = new THREE.ShapeGeometry(shape);
                  geometry.userData.id = wallEditor.subAreaGroupID;

                  const material = new THREE.MeshBasicMaterial({
                    color: 0xff0000,
                    side: THREE.DoubleSide,
                  });
                  const mesh = new THREE.Mesh(geometry, material);

                  mesh.userData.id = wallEditor.subAreaGroupID;
                  wallEditor.scene.add(mesh);

                  ////////////////////////////////////////////////////////
                  // console.log(wallEditor.testing);

                  break;

                  ///////////////////////////////////////
                }
              }
            }
          }
        }

        ////////////////////////////////////////////////////
      };

      ///////

      // wallEditor.spherePosition[wallEditor.subAreaGroupID].push(
      //   ...cornerPoints
      // ); //////check

      wallEditor.renderer.domElement.addEventListener("click", clickHandler);
    }
  }

  subAreaTempLine(event) {
    let intersectionPoint = this.getIntersectionPoint(event);

    let currentPoint =
      wallEditor.linesArray[wallEditor.linesArray.length - 1].start;

    const outlineVertices = [
      currentPoint.x,
      currentPoint.y,
      0,
      intersectionPoint.x,
      intersectionPoint.y,
      0,
    ];

    // wallEditor.allVerticesofSubArea.push(newP2.x, newP2.y, 0);

    const outlineGeometry = new THREE.BufferGeometry();
    outlineGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(outlineVertices, 3)
    );

    outlineGeometry.userData.id = wallEditor.subAreaGroupID;
    // }
    // console.log(wallEditor.subAreaGroupID);

    const outlineMaterial = new THREE.LineBasicMaterial({
      color: wallEditor.color,
      // color:'pink'
    });
    const tempLine = new THREE.LineSegments(outlineGeometry, outlineMaterial);

    wallEditor.scene.remove(wallEditor.subAreaTempLine);

    wallEditor.subAreaTempLine = tempLine;

    wallEditor.scene.add(wallEditor.subAreaTempLine);
  }

  stretchSubArea(event) {
    let intersectionPoint = this.getIntersectionPoint(event);

    wallEditor.latestMouseDownPosition.x = [...intersectionPoint][0];
    wallEditor.latestMouseDownPosition.y = [...intersectionPoint][1];

    wallEditor.lineDots[1].forEach((dot) => {
      dot.visible = true;
    });

    // wallEditor.scene.children.forEach((each) => {
    //   if (each.isLineSegments) {
    //     each.visible = true;
    //   }
    // });

    wallEditor.tempActivator = !wallEditor.tempActivator;

    wallEditor.spherePosition[1][wallEditor.selectedEdgePoint - 1] = {
      x: wallEditor.latestMouseDownPosition.x,
      y: wallEditor.latestMouseDownPosition.y,
    };

    let points = wallEditor.spherePosition[1];
    // console.log(points);

    const shape = new THREE.Shape();

    const outlinePoints = [];

    shape.moveTo(points[0].x, points[0].y); // Move to the starting point

    //setting the closing point to the strting point
    wallEditor.spherePosition[1][wallEditor.spherePosition[1].length - 1] =
      wallEditor.spherePosition[1][0];

    for (let i = 0; i < points.length; i++) {
      shape.lineTo(points[i].x, points[i].y);
      outlinePoints.push(new THREE.Vector3(points[i].x, points[i].y, 0));
    }
    // console.log(outlinePoints);

    // Close the shape by drawing a line from the last point to the starting point
    shape.lineTo(points[0].x, points[0].y);


    wallEditor.scene.children.forEach((child) => {
      if (child.userData.id === wallEditor.subAreaGroupID) {
        wallEditor.scene.remove(child);
      }
    });

    // staticComponents.clearScene(wallEditor.scene);


    //try clearing the scene
    this.updateLinesAgain(outlinePoints);
    this.removeDuplicateLineIds();


    ///////////////////////////////////////////////////

    const geometry = new THREE.ShapeGeometry(shape);
    geometry.userData.id = wallEditor.subAreaGroupID;

    const material = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(geometry, material);

    mesh.userData.id = wallEditor.subAreaGroupID;

    wallEditor.scene.children.forEach((each) => {
      if (each.isMesh && each.userData.id === wallEditor.subAreaGroupID) {
        wallEditor.scene.remove(each);
      }
    });

    wallEditor.scene.add(mesh);

    //adiong spheres

    // Add corner points as spheres
    const sphereGeometry = new THREE.SphereGeometry(0.01, 32, 32);
    //  sphereGeometry.userData.id = wallEditor.subAreaGroupID;

    const sphereMaterial = new THREE.MeshBasicMaterial({
      color: "#9BCF53",
    });

    // Create a group to hold the spheres

    wallEditor.dotsGroup.children.forEach((child) => {
      wallEditor.dotsGroup.remove(child);
    });

    //BreakPoint
    // wallEditor.scene.children.forEach((children) => {
    //   if (children.isLineSegments) {
    //     wallEditor.scene.remove(children);
    //   }
    //   console.log(children);
    // });
    let tempSpherePointer = 0;

    [...points].forEach((point) => {
      const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
      sphere.position.set(point.x, point.y, 0);
      sphere.userData.id = wallEditor.subAreaGroupID;

      tempSpherePointer = tempSpherePointer + 1;
      sphere.userData.sphereId = tempSpherePointer;

      wallEditor.dotsGroup.add(sphere);

      if (wallEditor.lineDots[wallEditor.subAreaGroupID]) {
        wallEditor.lineDots[wallEditor.subAreaGroupID] = [];
        wallEditor.lineDots[wallEditor.subAreaGroupID].push(sphere);
      }
      ///////////

      function removeDuplicateSpheres() {
        const uniqueSphereIds = new Set();
        const dotsGroup = wallEditor.dotsGroup;
        const children = dotsGroup.children;

        // Iterate through the dotsGroup children to find and remove duplicates
        for (let i = children.length - 1; i >= 0; i--) {
          const sphere = children[i];
          const sphereId = sphere.userData.sphereId;

          if (uniqueSphereIds.has(sphereId)) {
            // Duplicate found, remove this sphere
            dotsGroup.remove(sphere);
          } else {
            // Add to set of unique sphere IDs
            uniqueSphereIds.add(sphereId);
          }
        }
      }

      removeDuplicateSpheres();

      // this.removeDuplicateLineIds();

      ///////////
    });
    wallEditor.dotsGroup.children.pop();

    /////////////////////

  
    //////////////////////

    // Initialize all dots to green when creating the dots

    // for (const dot of wallEditor.dotsGroup.children) {
    //   dot.material.color.set("lightgreen");
    // }

    // // Change the color of the selected dot
    // const selectedDot =
    //   wallEditor.dotsGroup.children[wallEditor.selectedEdgePoint - 1];
    // if (selectedDot && selectedDot.material && selectedDot.material.color) {
    //   selectedDot.material.color.set("green");
    // }
  }

  removeDuplicateLineIds() {
    const seenIds = new Set();
    const linesToRemove = [];

    for (const child of wallEditor.scene.children) {
      if (
        child.geometry &&
        child.geometry.userData &&
        child.geometry.userData.lineId !== undefined
      ) {
        const lineId = child.geometry.userData.lineId;
        if (seenIds.has(lineId)) {
          linesToRemove.push(child);
        } else {
          seenIds.add(lineId);
        }
      }
    }

    for (const line of linesToRemove) {
      wallEditor.scene.remove(line);
    }
  }

  updateLinesAgain(outlinePoints) {
    for (let i = 0; i < outlinePoints.length; i++) {
      const startPoint = outlinePoints[i];
      const endPoint = outlinePoints[(i + 1) % outlinePoints.length]; // Loop back to the first point

      const lineGeometry = new THREE.BufferGeometry().setFromPoints([
        startPoint,
        endPoint,
      ]);
      lineGeometry.userData.id = wallEditor.subAreaGroupID;

      // lineGeometry.userData.lineId = i ; // Assign a unique lineId
      lineGeometry.userData.lineId = i + 1;

      const lineMaterial = new THREE.LineBasicMaterial({
        color: "blue",
      });

      const lineMesh = new THREE.Line(lineGeometry, lineMaterial);
      // lineMesh.userData.lineId = i ; // Assign a unique lineId to the mesh

      lineMesh.userData.lineId = i + 1;

      lineMesh.userData.id = wallEditor.subAreaGroupID;

      wallEditor.subAreaOutlineMesh = lineMesh;
      wallEditor.scene.add(wallEditor.subAreaOutlineMesh);
    }
  }
  removePointBtn(removeId) {
    staticComponents.clearScene(wallEditor.scene);
    // wallEditor.scene.children.forEach((child) => {
    //   if (child.userData.id === wallEditor.subAreaGroupID) {
    //     wallEditor.scene.remove(child);
    //   }
    // });

    ///

    let points = wallEditor.spherePosition[1];
    wallEditor.spherePosition[1].splice(removeId - 1, 1);

    const outlinePoints = [];
    const shape = new THREE.Shape();

    shape.moveTo(points[0].x, points[0].y); // Move to the starting point

    //setting the closing point to the strting point
    wallEditor.spherePosition[1][wallEditor.spherePosition[1].length - 1] =
      wallEditor.spherePosition[1][0];

    for (let i = 0; i < points.length; i++) {
      shape.lineTo(points[i].x, points[i].y);
      outlinePoints.push(new THREE.Vector3(points[i].x, points[i].y, 0));
    }

    // Close the shape by drawing a line from the last point to the starting point
    shape.lineTo(points[0].x, points[0].y);

    ///Points

    let tempSpherePointer = 0;

    const sphereGeometry = new THREE.SphereGeometry(0.01, 32, 32);
    //  sphereGeometry.userData.id = wallEditor.subAreaGroupID;

    const sphereMaterial = new THREE.MeshBasicMaterial({
      color: "#9BCF53",
    });

    [...points].forEach((point) => {
      const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
      sphere.position.set(point.x, point.y, 0);
      sphere.userData.id = wallEditor.subAreaGroupID;

      tempSpherePointer = tempSpherePointer + 1;
      sphere.userData.sphereId = tempSpherePointer;

      wallEditor.dotsGroup.add(sphere);
      wallEditor.scene.add(wallEditor.dotsGroup);

      if (wallEditor.lineDots[wallEditor.subAreaGroupID]) {
        wallEditor.lineDots[wallEditor.subAreaGroupID] = [];
        wallEditor.lineDots[wallEditor.subAreaGroupID].push(sphere);
      }
    });

    ///Outline
    this.updateLinesAgain(outlinePoints);
    this.removeDuplicateLineIds();

    //Mesh
    const geometry = new THREE.ShapeGeometry(shape);
    geometry.userData.id = wallEditor.subAreaGroupID;

    const material = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(geometry, material);

    mesh.userData.id = wallEditor.subAreaGroupID;
    wallEditor.scene.add(mesh);

    //update remove point Flag
    wallEditor.activateRemovePoint = !wallEditor.activateRemovePoint;
  }

  removeMeshAndDotsBySubAreaGroupId(id) {
    wallEditor.scene.children.forEach((each) => {
      if (each.isGroup) {
        each.children.forEach((eachMesh) => {
          if (eachMesh.userData.id == wallEditor.subAreaGroupID) {
            console.log("remove that mesh");
            wallEditor.scene.remove(eachMesh);
            eachMesh.geometry.dispose();
            eachMesh.material.dispose();
          }
        });
      }
    });

    //check afterwards

    wallEditor.scene.children.forEach((eachChild) => {
      if (eachChild.isLineSegments) {
        if (eachChild.geometry.userData.id === wallEditor.subAreaGroupID) {
          wallEditor.scene.remove(eachChild);
          eachChild.geometry.dispose();
          eachChild.material.dispose();
        }
      }
      // wallEditor.scene.children[0].children
      // console.log(eachChild === 'Group')
    });

    if (wallEditor.subAreaDotsGroups) {
      wallEditor.subAreaDotsGroups.forEach((sphere) => {
        if (sphere.userData.id === wallEditor.subAreaGroupID) {
          wallEditor.dotsGroup.remove(sphere); // Remove from dotsGroup

          sphere.geometry.dispose();
          sphere.material.dispose();
        }
      });
      delete wallEditor.subAreaDotsGroups[id]; // Remove from subAreaDotsGroups
    }

    for (let i = wallEditor.linesArray.length - 1; i >= 0; i--) {
      const line = wallEditor.linesArray[i];

      if (line.subAreaGroupID === wallEditor.subAreaGroupID) {
        // Remove mesh from the scene and dispose of it
        if (line.subAreaOutlineMesh) {
          wallEditor.scene.remove(line.subAreaOutlineMesh);

          // line.subAreaOutlineMesh.geometry.dispose();
          // line.subAreaOutlineMesh.material.dispose();
        }

        wallEditor.linesArray.splice(i, 1);
      }
    }
  }
}

export default SubAreaDrawer;
