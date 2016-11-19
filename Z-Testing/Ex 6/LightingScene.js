var degToRad = Math.PI / 180.0;

var BOARD_WIDTH = 6.0;
var BOARD_HEIGHT = 4.0;

var BOARD_A_DIVISIONS = 1;
var BOARD_B_DIVISIONS = 100;

function LightingScene() {
	CGFscene.call(this);
}

LightingScene.prototype = Object.create(CGFscene.prototype);
LightingScene.prototype.constructor = LightingScene;

LightingScene.prototype.init = function(application) {
	CGFscene.prototype.init.call(this, application);

	this.light0 = true;
	this.light1 = true; 
	this.light2 = true;
	this.light3 = true;

	this.animateClock = true; 
	this.RotationFactor = 1;

	this.initCameras();

	this.initLights();

	this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
	this.gl.clearDepth(100.0);
	this.gl.enable(this.gl.DEPTH_TEST);
	this.gl.enable(this.gl.CULL_FACE);
	this.gl.depthFunc(this.gl.LEQUAL);
	this.gl.enable(this.gl.BLEND);
	this.gl.blendEquation(this.gl.FUNC_ADD);
	this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA); 
	this.gl.depthFunc(this.gl.LEQUAL);
	this.gl.depthMask(true);

	this.axis = new CGFaxis(this);

	this.enableTextures(true);


	// testing
	this.plane = new MyPlane(this, 10, 10, 10, 10);


	// Scene elements
	this.prism = new MyPrism(this, 8, 20);
	this.cylinder = new MyCylinder(this, 8, 20);
	this.lamp = new MySemiSphere(this, 8, 20);
	this.table = new MyTable(this);
	this.rightWall = new Plane(this);
	this.leftWall = new MyQuad(this, -0.5, 1.5, -0.5, 1.5);
	this.floor = new MyQuad(this, 0, 10, 0, 12);
	this.boardA = new Plane(this, BOARD_A_DIVISIONS, 0, 1, 0, 1);
	this.boardB = new Plane(this, BOARD_B_DIVISIONS, 0, 1, 0, 1);
	
	this.clock = new MyClock(this, 12, 1);
	this.currClockTime = 0;	// clock time has to be saved, for when it's stopped
	this.elapsedClockTime = 0; // time that has passed since clock has been stopped

	this.clock = new MyClock(this, 12, 1);
	this.drone = new MyDroneHandler(this, 15, 4, 15, -180);
	this.cargo = new MyCargo(this, 8.5, 8.1, 6);
	this.loadingZone = new MyLoadingZone(this, 13, 0, 7.5);

	this.initAppearances();

	var color1 = [1, 0, 0, 1];
	var color2 = [0, 1, 0, 1];
	var colorselected = [1, 1, 1, 1];

	this.chessboard = new MyChessboard(this, 10, 10, 5, 5, "../resources/images/floor.png", color1, color2, colorselected, this.materialDefault);

	//Set update function
	this.updatePeriod = 1/60 * 1000;	// update period in ms (1/60 * 1000 ms = 60 Hz)
	this.setUpdatePeriod(this.updatePeriod);

};

LightingScene.prototype.AnimateClock = function (){
	if(this.animateClock)
		this.animateClock = false;
	else
		this.animateClock = true;
	
};

LightingScene.prototype.update = function(currTime){
	var bodyIndex, legIndex, heliceIndex;
	switch(this.DroneBodyAppearance){
		case 'Army': bodyIndex = 0; break;
		case 'Colorful': bodyIndex = 1; break;
		case 'Wood': bodyIndex = 2; break;
		case 'Metallic': bodyIndex = 3; break;
	}

	switch(this.DroneLegAppearance){
		case 'Army': legIndex = 0; break;
		case 'Colorful': legIndex = 1; break;
		case 'Wood': legIndex = 2; break;
		case 'Metallic': legIndex = 3; break;
	}

	switch(this.DroneHeliceAppearance){
		case 'Army': heliceIndex = 0; break;
		case 'Colorful': heliceIndex = 1; break;
		case 'Wood': heliceIndex = 2; break;
		case 'Metallic': heliceIndex = 3; break;
	}

	if(this.drone.packageState == this.drone.delivery.Collecting){
		this.drone.checkCargoLoad(this.cargo);
		if(this.drone.packageState == this.drone.delivery.Delivering){
			this.cargo.paperAppearance.setShininess(0);
		}
	}

	this.drone.updateTexturesIndex(bodyIndex, legIndex, heliceIndex);
	this.drone.setRotationFactor(this.RotationFactor);
	
	if(this.animateClock)	// counts towards clock time
	{
		this.currClockTime = currTime - this.elapsedClockTime;
		this.clock.update(this.currClockTime);
	}
	else	// counts towards lost time
	{
		this.elapsedClockTime = currTime - this.currClockTime;
	}

	this.drone.update(currTime);

	if (this.drone.packageState == this.drone.delivery.Delivering){
		var hook = this.drone.getHook();
		var xInc = this.drone.motionVelocity * Math.sin(this.drone.angle*degToRad);
		var yInc = hook.y - 0.5;
		var zInc = this.drone.motionVelocity * Math.cos(this.drone.angle*degToRad);
		this.cargo.updateCoordinates(xInc, yInc, zInc);
		this.cargo.pitchAngle = this.drone.pitchAngle;
		this.drone.checkCargoDrop(this.cargo, this.loadingZone);
		if(this.drone.packageState == this.drone.delivery.Delivered){
			this.cargo.paperAppearance.setShininess(120);
		}
	}
}

LightingScene.prototype.initCameras = function() {
	this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(30, 30, 30), vec3.fromValues(0, 0, 0));
};

LightingScene.prototype.initLights = function() {
	//this.setGlobalAmbientLight(0.5,0.5,0.5, 1.0);
	this.setGlobalAmbientLight(1,1,1, 1.0);
	
	// Positions for four lights
	this.lights[0].setPosition(4, 6, 1, 1);
	this.lights[1].setPosition(10.5, 6.0, 1.0, 1.0);
	this.lights[2].setPosition(7.5, 7.5, 7.5, 1.0);
	this.lights[3].setPosition(4, 6.0, 5.0, 1.0);

	this.lights[0].setAmbient(0, 0, 0, 1);
	this.lights[0].setDiffuse(1.0, 1.0, 1.0, 1.0);
	this.lights[0].setSpecular(1, 1, 0, 1);
	this.lights[0].enable();

	this.lights[1].setAmbient(0, 0, 0, 1);
	this.lights[1].setDiffuse(1.0, 1.0, 1.0, 1.0);
	this.lights[1].enable();

	this.lights[2].setSpecular(1,1,1,1);
	this.lights[2].setConstantAttenuation(0);
	this.lights[2].setLinearAttenuation(1);
	this.lights[2].enable();

	this.lights[3].setConstantAttenuation(0);
	this.lights[3].setLinearAttenuation(0);
	this.lights[3].setQuadraticAttenuation(0.2);
	this.lights[3].enable();
};

LightingScene.prototype.initAppearances = function() {
	this.materialDefault = new CGFappearance(this);

	this.floorAppearance = new CGFappearance(this);
	this.floorAppearance.loadTexture("../resources/images/floor.png")

	this.windowAppearance = new CGFappearance(this);
	this.windowAppearance.loadTexture("../resources/images/window.png")
	this.windowAppearance.setTextureWrap('CLAMP_TO_EDGE', 'CLAMP_TO_EDGE');

	this.boardAppearance = new CGFappearance(this);
	this.boardAppearance.loadTexture("../resources/images/board.png")	
	this.boardAppearance.setDiffuse(0.3, 0.3, 0.3,1);
	this.boardAppearance.setSpecular(0.6, 0.6, 0.6,1);	
	this.boardAppearance.setShininess(120);

	this.slidesAppearance= new CGFappearance(this);
	this.slidesAppearance.loadTexture("../resources/images/slides.png")	
	this.slidesAppearance.setTextureWrap('CLAMP_TO_EDGE', 'CLAMP_TO_EDGE');
	this.slidesAppearance.setDiffuse(0.9, 0.9, 0.9,1);
	this.slidesAppearance.setSpecular(0.2, 0.2, 0.2,1);	
	this.slidesAppearance.setShininess(30);

	this.columnAppearance = new CGFappearance(this);
	this.columnAppearance.loadTexture("../resources/images/Column.png")	
	this.columnAppearance.setDiffuse(0.3, 0.3, 0.3, 1);

	this.lampAppearance = new CGFappearance(this);
	this.lampAppearance.loadTexture("../resources/images/Lamp.jpg")	
	this.lampAppearance.setDiffuse(0.3, 0.3, 0.3, 1);

	//drone appearances
	this.droneAppearanceList = ['Army', 'Colorful', 'Wood', 'Metallic']
	this.DroneBodyAppearance = 'Colorful';
	this.DroneHeliceAppearance = 'Colorful';
	this.DroneLegAppearance = 'Colorful';

}

LightingScene.prototype.updateLights = function() {
	
	for (i = 0; i < this.lights.length; i++){
		this.lights[i].update();
	}

	if(this.light0)
		this.lights[0].enable();
	else this.lights[0].disable();


	if(this.light1)
		this.lights[1].enable();
	else this.lights[1].disable();

	if(this.light2)
		this.lights[2].enable();
	else this.lights[2].disable();

	if(this.light3)
		this.lights[3].enable();
	else this.lights[3].disable();
		

}


LightingScene.prototype.display = function() {

	// ---- BEGIN Background, camera and axis setup

	// Clear image and depth buffer everytime we update the scene
	this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
	this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

	// Initialize Model-View matrix as identity (no transformation)
	this.updateProjectionMatrix();
	this.loadIdentity();

	// Apply transformations corresponding to the camera position relative to the origin
	this.applyViewMatrix();

	// Update all lights used
	this.updateLights();

	// Draw axis
	this.axis.display();

	this.materialDefault.apply();

	// ---- END Background, camera and axis setup

	
	// ---- BEGIN Geometric transformation section

	this.chessboard.display();

// Floor
	this.pushMatrix();
	this.translate(7.5, 0, 7.5);
	this.rotate(-90 * degToRad, 1, 0, 0);
	this.scale(15, 15, 0.2);
	this.floorAppearance.apply();
	this.floor.display();
	this.popMatrix();

	this.materialDefault.apply();

	// Left Wall
	this.pushMatrix();
	this.translate(0, 4, 7.5);
	this.rotate(90 * degToRad, 0, 1, 0);
	this.scale(15, 8, 0.2);
	this.windowAppearance.apply();
	this.leftWall.display();
	this.popMatrix();

	this.materialDefault.apply();

	// Plane Wall
	this.pushMatrix();
	this.translate(7.5, 4, 0);
	this.scale(15, 8, 0.2);
	this.rightWall.display();
	this.popMatrix();

	// First Table
	this.pushMatrix();
	this.translate(2, 0, 2);
	this.table.display();
	this.popMatrix();

	// Second Table
	this.pushMatrix();
	this.translate(9, 0, 11);
		this.table.display();
	this.popMatrix();

	// default material apply
	this.materialDefault.apply();
	
	// Board A
	this.pushMatrix();
	this.translate(4, 4.5, 0.2);
	this.scale(BOARD_WIDTH, BOARD_HEIGHT, 1);
	this.slidesAppearance.apply();
	this.boardA.display();
	this.popMatrix();

	this.materialDefault.apply();

	// Board B
	this.pushMatrix();
	this.translate(10.5, 4.5, 0.2);
	this.scale(BOARD_WIDTH, BOARD_HEIGHT, 1);
	this.boardAppearance.apply();
	this.boardB.display();
	this.popMatrix();

	this.materialDefault.apply();

	// cylinder 1
	this.pushMatrix();
	this.translate(2, 0, 13);
	this.rotate(-90 * degToRad, 1, 0, 0)
	this.scale(1, 1, 8);
	this.columnAppearance.apply();
	this.cylinder.display();
	this.popMatrix();
	
	// cylinder 2
	this.pushMatrix();
	this.translate(13, 0, 2);
	this.rotate(-90 * degToRad, 1, 0, 0)
	this.scale(1, 1, 8);
	this.cylinder.display();
	this.popMatrix();

	this.materialDefault.apply();

	// lamp
	this.pushMatrix();
	this.translate(7.5, 7.5, 7.5);
	this.rotate(-90 * degToRad, 1, 0, 0)
	this.lampAppearance.apply();
	this.lamp.display();
	this.popMatrix();

	//clock
	this.pushMatrix();
	this.translate(7.25, 7.20, 0);
	this.scale(0.75, 0.75, 0.15);
	this.clock.display();
	this.popMatrix();

	//drone
	this.pushMatrix();
	this.scale(0.5, 0.5, 0.5)
	this.drone.display();
	this.popMatrix();
	
	//cargo
	this.materialDefault.apply();
	this.pushMatrix();
	this.scale(0.5, 0.5, 0.5);
	this.cargo.display();
	this.popMatrix();
	
	//loadingZone
	this.materialDefault.apply();
	this.pushMatrix();
	this.loadingZone.display();
	this.popMatrix();
	

	// ---- END Geometric transformation section


	// ---- BEGIN Primitive drawing section

	// ---- END Primitive drawing section

};
