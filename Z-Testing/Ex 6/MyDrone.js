/**
 * MyDrone
 * @constructor
 */
 function MyDrone(scene) {
 	CGFobject.call(this,scene);
	
	this.body = new MyDroneBody(scene); 
	this.rightLeg = new MyDroneLeg(scene); 
	this.leftLeg = new MyDroneLeg(scene);
	this.northHelice = new MyDroneHelice(scene);
	this.southHelice = new MyDroneHelice(scene);
	this.westHelice = new MyDroneHelice(scene);
	this.eastHelice = new MyDroneHelice(scene);
	this.hook = new MyDroneHook(scene, 0, 1, 0, 1);

	this.initTextures(scene);
 };

MyDrone.prototype = Object.create(CGFobject.prototype);
MyDrone.prototype.constructor = MyDrone;

MyDrone.prototype.display = function() {
	this.textures[this.bodyTextureIndex].apply();
	this.body.display();

	this.textures[this.legTextureIndex].apply();
	this.rightLeg.display();
	this.leftLeg.display();
	//this.hook.display();
	
	this.textures[this.heliceTextureIndex].apply();
	this.scene.pushMatrix();
	this.scene.translate(0, 0.15, 2.85);
	this.northHelice.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
	this.scene.translate(-2.85, 0.15, 0);
	this.westHelice.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
	this.scene.translate(2.85, 0.15, 0);
	this.eastHelice.display();
	this.scene.popMatrix();

	this.scene.pushMatrix();
	this.scene.translate(0, 0.15, -2.85);
	this.southHelice.display();
	this.scene.popMatrix();
}

MyDrone.prototype.initTextures = function(scene){
	this.colorfulAppearance = new CGFappearance(scene);
	this.colorfulAppearance.loadTexture("../resources/images/Colorful.jpg");
	this.colorfulAppearance.setTextureWrap('CLAMP_TO_EDGE', 'CLAMP_TO_EDGE');	
	this.colorfulAppearance.setDiffuse(0.3, 0.3, 0.3,1);
	this.colorfulAppearance.setSpecular(0.6, 0.6, 0.6,1);	
	this.colorfulAppearance.setShininess(120);

	this.armyAppearance = new CGFappearance(scene);
	this.armyAppearance.loadTexture("../resources/images/Army.jpg");
	this.armyAppearance.setTextureWrap('CLAMP_TO_EDGE', 'CLAMP_TO_EDGE');	
	this.armyAppearance.setDiffuse(0.3, 0.3, 0.3,1);
	this.armyAppearance.setSpecular(0.6, 0.6, 0.6,1);	
	this.armyAppearance.setShininess(120);

	this.metallicAppearance = new CGFappearance(scene);
	this.metallicAppearance.loadTexture("../resources/images/Metallic.jpg");
	this.metallicAppearance.setTextureWrap('CLAMP_TO_EDGE', 'CLAMP_TO_EDGE');
	this.metallicAppearance.setDiffuse(0.3, 0.3, 0.3,1);
	this.metallicAppearance.setSpecular(0.6, 0.6, 0.6,1);	
	this.metallicAppearance.setShininess(120);

	this.woodAppearance = new CGFappearance(scene);
	this.woodAppearance.loadTexture("../resources/images/Wood.jpg");
	this.woodAppearance.setTextureWrap('CLAMP_TO_EDGE', 'CLAMP_TO_EDGE');
	this.woodAppearance.setDiffuse(0.3, 0.3, 0.3,1);
	this.woodAppearance.setSpecular(0.6, 0.6, 0.6,1);	
	this.woodAppearance.setShininess(120);

	this.textures = [];
	this.textures.push(this.armyAppearance, this.colorfulAppearance, this.woodAppearance, this.metallicAppearance);
	this.bodyTextureIndex = 0;
	this.legTextureIndex = 0;
	this.heliceTextureIndex = 0;
}

MyDrone.prototype.setHelicesAngle = function(elapsedTime, rotationFactor){
	var aux = elapsedTime * rotationFactor;
	this.northHelice.update(aux);
	this.southHelice.update(aux);
	this.eastHelice.update(-aux);
	this.westHelice.update(-aux);
}

MyDrone.prototype.setHelicesRotationSpeed = function(northHelice, southHelice, eastHelice, westHelice){
	this.northHelice.setRotationSpeed(northHelice);
	this.southHelice.setRotationSpeed(southHelice);
	this.eastHelice.setRotationSpeed(eastHelice);
	this.westHelice.setRotationSpeed(westHelice);
}

