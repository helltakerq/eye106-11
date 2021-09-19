THREE.OrbitControls=function(object,domElement){if(domElement===undefined)console.warn('THREE.OrbitControls: The second parameter "domElement" is now mandatory.');if(domElement===document)console.error('THREE.OrbitControls: "document" should not be used as the target "domElement". Please use "renderer.domElement" instead.');this.object=object;this.domElement=domElement;this.enabled=!0;this.target=new THREE.Vector3();this.minDistance=0;this.maxDistance=Infinity;this.minZoom=0;this.maxZoom=Infinity;this.minPolarAngle=0;this.maxPolarAngle=Math.PI;this.minAzimuthAngle=-Infinity;this.maxAzimuthAngle=Infinity;this.enableDamping=!1;this.dampingFactor=0.05;this.enableZoom=!0;this.zoomSpeed=1.0;this.enableRotate=!0;this.rotateSpeed=1.0;this.enablePan=!0;this.panSpeed=1.0;this.screenSpacePanning=!1;this.keyPanSpeed=7.0;this.autoRotate=!1;this.autoRotateSpeed=2.0;this.enableKeys=!0;this.keys={LEFT:37,UP:38,RIGHT:39,BOTTOM:40};this.mouseButtons={LEFT:THREE.MOUSE.ROTATE,MIDDLE:THREE.MOUSE.DOLLY,RIGHT:THREE.MOUSE.PAN};this.touches={ONE:THREE.TOUCH.ROTATE,TWO:THREE.TOUCH.DOLLY_PAN};this.target0=this.target.clone();this.position0=this.object.position.clone();this.zoom0=this.object.zoom;this.getPolarAngle=function(){return spherical.phi};this.getAzimuthalAngle=function(){return spherical.theta};this.saveState=function(){scope.target0.copy(scope.target);scope.position0.copy(scope.object.position);scope.zoom0=scope.object.zoom};this.reset=function(){scope.target.copy(scope.target0);scope.object.position.copy(scope.position0);scope.object.zoom=scope.zoom0;scope.object.updateProjectionMatrix();scope.dispatchEvent(changeEvent);scope.update();state=STATE.NONE};this.update=function(){var offset=new THREE.Vector3();var quat=new THREE.Quaternion().setFromUnitVectors(object.up,new THREE.Vector3(0,1,0));var quatInverse=quat.clone().inverse();var lastPosition=new THREE.Vector3();var lastQuaternion=new THREE.Quaternion();return function update(){var position=scope.object.position;offset.copy(position).sub(scope.target);offset.applyQuaternion(quat);spherical.setFromVector3(offset);if(scope.autoRotate&&state===STATE.NONE){rotateLeft(getAutoRotationAngle())}
if(scope.enableDamping){spherical.theta+=sphericalDelta.theta*scope.dampingFactor;spherical.phi+=sphericalDelta.phi*scope.dampingFactor}else{spherical.theta+=sphericalDelta.theta;spherical.phi+=sphericalDelta.phi}
spherical.theta=Math.max(scope.minAzimuthAngle,Math.min(scope.maxAzimuthAngle,spherical.theta));spherical.phi=Math.max(scope.minPolarAngle,Math.min(scope.maxPolarAngle,spherical.phi));spherical.makeSafe();spherical.radius*=scale;spherical.radius=Math.max(scope.minDistance,Math.min(scope.maxDistance,spherical.radius));if(scope.enableDamping===!0){scope.target.addScaledVector(panOffset,scope.dampingFactor)}else{scope.target.add(panOffset)}
offset.setFromSpherical(spherical);offset.applyQuaternion(quatInverse);position.copy(scope.target).add(offset);scope.object.lookAt(scope.target);if(scope.enableDamping===!0){sphericalDelta.theta*=(1-scope.dampingFactor);sphericalDelta.phi*=(1-scope.dampingFactor);panOffset.multiplyScalar(1-scope.dampingFactor)}else{sphericalDelta.set(0,0,0);panOffset.set(0,0,0)}
scale=1;if(zoomChanged||lastPosition.distanceToSquared(scope.object.position)>EPS||8*(1-lastQuaternion.dot(scope.object.quaternion))>EPS){scope.dispatchEvent(changeEvent);lastPosition.copy(scope.object.position);lastQuaternion.copy(scope.object.quaternion);zoomChanged=!1;return!0}
return!1}}();this.dispose=function(){scope.domElement.removeEventListener('contextmenu',onContextMenu,!1);scope.domElement.removeEventListener('mousedown',onMouseDown,!1);scope.domElement.removeEventListener('wheel',onMouseWheel,!1);scope.domElement.removeEventListener('touchstart',onTouchStart,!1);scope.domElement.removeEventListener('touchend',onTouchEnd,!1);scope.domElement.removeEventListener('touchmove',onTouchMove,!1);document.removeEventListener('mousemove',onMouseMove,!1);document.removeEventListener('mouseup',onMouseUp,!1);scope.domElement.removeEventListener('keydown',onKeyDown,!1)};var scope=this;var changeEvent={type:'change'};var startEvent={type:'start'};var endEvent={type:'end'};var STATE={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6};var state=STATE.NONE;var EPS=0.000001;var spherical=new THREE.Spherical();var sphericalDelta=new THREE.Spherical();var scale=1;var panOffset=new THREE.Vector3();var zoomChanged=!1;var rotateStart=new THREE.Vector2();var rotateEnd=new THREE.Vector2();var rotateDelta=new THREE.Vector2();var panStart=new THREE.Vector2();var panEnd=new THREE.Vector2();var panDelta=new THREE.Vector2();var dollyStart=new THREE.Vector2();var dollyEnd=new THREE.Vector2();var dollyDelta=new THREE.Vector2();function getAutoRotationAngle(){return 2*Math.PI/60/60*scope.autoRotateSpeed}
function getZoomScale(){return Math.pow(0.95,scope.zoomSpeed)}
function rotateLeft(angle){sphericalDelta.theta-=angle}
function rotateUp(angle){sphericalDelta.phi-=angle}
var panLeft=function(){var v=new THREE.Vector3();return function panLeft(distance,objectMatrix){v.setFromMatrixColumn(objectMatrix,0);v.multiplyScalar(-distance);panOffset.add(v)}}();var panUp=function(){var v=new THREE.Vector3();return function panUp(distance,objectMatrix){if(scope.screenSpacePanning===!0){v.setFromMatrixColumn(objectMatrix,1)}else{v.setFromMatrixColumn(objectMatrix,0);v.crossVectors(scope.object.up,v)}
v.multiplyScalar(distance);panOffset.add(v)}}();var pan=function(){var offset=new THREE.Vector3();return function pan(deltaX,deltaY){var element=scope.domElement;if(scope.object.isPerspectiveCamera){var position=scope.object.position;offset.copy(position).sub(scope.target);var targetDistance=offset.length();targetDistance*=Math.tan((scope.object.fov/2)*Math.PI/180.0);panLeft(2*deltaX*targetDistance/element.clientHeight,scope.object.matrix);panUp(2*deltaY*targetDistance/element.clientHeight,scope.object.matrix)}else if(scope.object.isOrthographicCamera){panLeft(deltaX*(scope.object.right-scope.object.left)/scope.object.zoom/element.clientWidth,scope.object.matrix);panUp(deltaY*(scope.object.top-scope.object.bottom)/scope.object.zoom/element.clientHeight,scope.object.matrix)}else{console.warn('WARNING: OrbitControls.js encountered an unknown camera type - pan disabled.');scope.enablePan=!1}}}();function dollyOut(dollyScale){if(scope.object.isPerspectiveCamera){scale/=dollyScale}else if(scope.object.isOrthographicCamera){scope.object.zoom=Math.max(scope.minZoom,Math.min(scope.maxZoom,scope.object.zoom*dollyScale));scope.object.updateProjectionMatrix();zoomChanged=!0}else{console.warn('WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.');scope.enableZoom=!1}}
function dollyIn(dollyScale){if(scope.object.isPerspectiveCamera){scale*=dollyScale}else if(scope.object.isOrthographicCamera){scope.object.zoom=Math.max(scope.minZoom,Math.min(scope.maxZoom,scope.object.zoom/dollyScale));scope.object.updateProjectionMatrix();zoomChanged=!0}else{console.warn('WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.');scope.enableZoom=!1}}
function handleMouseDownRotate(event){rotateStart.set(event.clientX,event.clientY)}
function handleMouseDownDolly(event){dollyStart.set(event.clientX,event.clientY)}
function handleMouseDownPan(event){panStart.set(event.clientX,event.clientY)}
function handleMouseMoveRotate(event){rotateEnd.set(event.clientX,event.clientY);rotateDelta.subVectors(rotateEnd,rotateStart).multiplyScalar(scope.rotateSpeed);var element=scope.domElement;rotateLeft(2*Math.PI*rotateDelta.x/element.clientHeight);rotateUp(2*Math.PI*rotateDelta.y/element.clientHeight);rotateStart.copy(rotateEnd);scope.update()}
function handleMouseMoveDolly(event){dollyEnd.set(event.clientX,event.clientY);dollyDelta.subVectors(dollyEnd,dollyStart);if(dollyDelta.y>0){dollyOut(getZoomScale())}else if(dollyDelta.y<0){dollyIn(getZoomScale())}
dollyStart.copy(dollyEnd);scope.update()}
function handleMouseMovePan(event){panEnd.set(event.clientX,event.clientY);panDelta.subVectors(panEnd,panStart).multiplyScalar(scope.panSpeed);pan(panDelta.x,panDelta.y);panStart.copy(panEnd);scope.update()}
function handleMouseUp(){}
function handleMouseWheel(event){if(event.deltaY<0){dollyIn(getZoomScale())}else if(event.deltaY>0){dollyOut(getZoomScale())}
scope.update()}
function handleKeyDown(event){var needsUpdate=!1;switch(event.keyCode){case scope.keys.UP:pan(0,scope.keyPanSpeed);needsUpdate=!0;break;case scope.keys.BOTTOM:pan(0,-scope.keyPanSpeed);needsUpdate=!0;break;case scope.keys.LEFT:pan(scope.keyPanSpeed,0);needsUpdate=!0;break;case scope.keys.RIGHT:pan(-scope.keyPanSpeed,0);needsUpdate=!0;break}
if(needsUpdate){event.preventDefault();scope.update()}}
function handleTouchStartRotate(event){if(event.touches.length==1){rotateStart.set(event.touches[0].pageX,event.touches[0].pageY)}else{var x=0.5*(event.touches[0].pageX+event.touches[1].pageX);var y=0.5*(event.touches[0].pageY+event.touches[1].pageY);rotateStart.set(x,y)}}
function handleTouchStartPan(event){if(event.touches.length==1){panStart.set(event.touches[0].pageX,event.touches[0].pageY)}else{var x=0.5*(event.touches[0].pageX+event.touches[1].pageX);var y=0.5*(event.touches[0].pageY+event.touches[1].pageY);panStart.set(x,y)}}
function handleTouchStartDolly(event){var dx=event.touches[0].pageX-event.touches[1].pageX;var dy=event.touches[0].pageY-event.touches[1].pageY;var distance=Math.sqrt(dx*dx+dy*dy);dollyStart.set(0,distance)}
function handleTouchStartDollyPan(event){if(scope.enableZoom)handleTouchStartDolly(event);if(scope.enablePan)handleTouchStartPan(event)}
function handleTouchStartDollyRotate(event){if(scope.enableZoom)handleTouchStartDolly(event);if(scope.enableRotate)handleTouchStartRotate(event)}
function handleTouchMoveRotate(event){if(event.touches.length==1){rotateEnd.set(event.touches[0].pageX,event.touches[0].pageY)}else{var x=0.5*(event.touches[0].pageX+event.touches[1].pageX);var y=0.5*(event.touches[0].pageY+event.touches[1].pageY);rotateEnd.set(x,y)}
rotateDelta.subVectors(rotateEnd,rotateStart).multiplyScalar(scope.rotateSpeed);var element=scope.domElement;rotateLeft(2*Math.PI*rotateDelta.x/element.clientHeight);rotateUp(2*Math.PI*rotateDelta.y/element.clientHeight);rotateStart.copy(rotateEnd)}
function handleTouchMovePan(event){if(event.touches.length==1){panEnd.set(event.touches[0].pageX,event.touches[0].pageY)}else{var x=0.5*(event.touches[0].pageX+event.touches[1].pageX);var y=0.5*(event.touches[0].pageY+event.touches[1].pageY);panEnd.set(x,y)}
panDelta.subVectors(panEnd,panStart).multiplyScalar(scope.panSpeed);pan(panDelta.x,panDelta.y);panStart.copy(panEnd)}
function handleTouchMoveDolly(event){var dx=event.touches[0].pageX-event.touches[1].pageX;var dy=event.touches[0].pageY-event.touches[1].pageY;var distance=Math.sqrt(dx*dx+dy*dy);dollyEnd.set(0,distance);dollyDelta.set(0,Math.pow(dollyEnd.y/dollyStart.y,scope.zoomSpeed));dollyOut(dollyDelta.y);dollyStart.copy(dollyEnd)}
function handleTouchMoveDollyPan(event){if(scope.enableZoom)handleTouchMoveDolly(event);if(scope.enablePan)handleTouchMovePan(event)}
function handleTouchMoveDollyRotate(event){if(scope.enableZoom)handleTouchMoveDolly(event);if(scope.enableRotate)handleTouchMoveRotate(event)}
function handleTouchEnd(){}
function onMouseDown(event){if(scope.enabled===!1)return;event.preventDefault();scope.domElement.focus?scope.domElement.focus():window.focus();var mouseAction;switch(event.button){case 0:mouseAction=scope.mouseButtons.LEFT;break;case 1:mouseAction=scope.mouseButtons.MIDDLE;break;case 2:mouseAction=scope.mouseButtons.RIGHT;break;default:mouseAction=-1}
switch(mouseAction){case THREE.MOUSE.DOLLY:if(scope.enableZoom===!1)return;handleMouseDownDolly(event);state=STATE.DOLLY;break;case THREE.MOUSE.ROTATE:if(event.ctrlKey||event.metaKey||event.shiftKey){if(scope.enablePan===!1)return;handleMouseDownPan(event);state=STATE.PAN}else{if(scope.enableRotate===!1)return;handleMouseDownRotate(event);state=STATE.ROTATE}
break;case THREE.MOUSE.PAN:if(event.ctrlKey||event.metaKey||event.shiftKey){if(scope.enableRotate===!1)return;handleMouseDownRotate(event);state=STATE.ROTATE}else{if(scope.enablePan===!1)return;handleMouseDownPan(event);state=STATE.PAN}
break;default:state=STATE.NONE}
if(state!==STATE.NONE){document.addEventListener('mousemove',onMouseMove,!1);document.addEventListener('mouseup',onMouseUp,!1);scope.dispatchEvent(startEvent)}}
function onMouseMove(event){if(scope.enabled===!1)return;event.preventDefault();switch(state){case STATE.ROTATE:if(scope.enableRotate===!1)return;handleMouseMoveRotate(event);break;case STATE.DOLLY:if(scope.enableZoom===!1)return;handleMouseMoveDolly(event);break;case STATE.PAN:if(scope.enablePan===!1)return;handleMouseMovePan(event);break}}
function onMouseUp(event){if(scope.enabled===!1)return;handleMouseUp(event);document.removeEventListener('mousemove',onMouseMove,!1);document.removeEventListener('mouseup',onMouseUp,!1);scope.dispatchEvent(endEvent);state=STATE.NONE}
function onMouseWheel(event){if(scope.enabled===!1||scope.enableZoom===!1||(state!==STATE.NONE&&state!==STATE.ROTATE))return;event.preventDefault();event.stopPropagation();scope.dispatchEvent(startEvent);handleMouseWheel(event);scope.dispatchEvent(endEvent)}
function onKeyDown(event){if(scope.enabled===!1||scope.enableKeys===!1||scope.enablePan===!1)return;handleKeyDown(event)}
function onTouchStart(event){if(scope.enabled===!1)return;event.preventDefault();switch(event.touches.length){case 1:switch(scope.touches.ONE){case THREE.TOUCH.ROTATE:if(scope.enableRotate===!1)return;handleTouchStartRotate(event);state=STATE.TOUCH_ROTATE;break;case THREE.TOUCH.PAN:if(scope.enablePan===!1)return;handleTouchStartPan(event);state=STATE.TOUCH_PAN;break;default:state=STATE.NONE}
break;case 2:switch(scope.touches.TWO){case THREE.TOUCH.DOLLY_PAN:if(scope.enableZoom===!1&&scope.enablePan===!1)return;handleTouchStartDollyPan(event);state=STATE.TOUCH_DOLLY_PAN;break;case THREE.TOUCH.DOLLY_ROTATE:if(scope.enableZoom===!1&&scope.enableRotate===!1)return;handleTouchStartDollyRotate(event);state=STATE.TOUCH_DOLLY_ROTATE;break;default:state=STATE.NONE}
break;default:state=STATE.NONE}
if(state!==STATE.NONE){scope.dispatchEvent(startEvent)}}
function onTouchMove(event){if(scope.enabled===!1)return;event.preventDefault();event.stopPropagation();switch(state){case STATE.TOUCH_ROTATE:if(scope.enableRotate===!1)return;handleTouchMoveRotate(event);scope.update();break;case STATE.TOUCH_PAN:if(scope.enablePan===!1)return;handleTouchMovePan(event);scope.update();break;case STATE.TOUCH_DOLLY_PAN:if(scope.enableZoom===!1&&scope.enablePan===!1)return;handleTouchMoveDollyPan(event);scope.update();break;case STATE.TOUCH_DOLLY_ROTATE:if(scope.enableZoom===!1&&scope.enableRotate===!1)return;handleTouchMoveDollyRotate(event);scope.update();break;default:state=STATE.NONE}}
function onTouchEnd(event){if(scope.enabled===!1)return;handleTouchEnd(event);scope.dispatchEvent(endEvent);state=STATE.NONE}
function onContextMenu(event){if(scope.enabled===!1)return;event.preventDefault()}
scope.domElement.addEventListener('contextmenu',onContextMenu,!1);scope.domElement.addEventListener('mousedown',onMouseDown,!1);scope.domElement.addEventListener('wheel',onMouseWheel,!1);scope.domElement.addEventListener('touchstart',onTouchStart,!1);scope.domElement.addEventListener('touchend',onTouchEnd,!1);scope.domElement.addEventListener('touchmove',onTouchMove,!1);scope.domElement.addEventListener('keydown',onKeyDown,!1);if(scope.domElement.tabIndex===-1){scope.domElement.tabIndex=0}
this.update()};THREE.OrbitControls.prototype=Object.create(THREE.EventDispatcher.prototype);THREE.OrbitControls.prototype.constructor=THREE.OrbitControls;THREE.MapControls=function(object,domElement){THREE.OrbitControls.call(this,object,domElement);this.mouseButtons.LEFT=THREE.MOUSE.PAN;this.mouseButtons.RIGHT=THREE.MOUSE.ROTATE;this.touches.ONE=THREE.TOUCH.PAN;this.touches.TWO=THREE.TOUCH.DOLLY_ROTATE};THREE.MapControls.prototype=Object.create(THREE.EventDispatcher.prototype);THREE.MapControls.prototype.constructor=THREE.MapControls