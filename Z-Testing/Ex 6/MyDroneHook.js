/**
 * MyDroneHook
 * @constructor
 */
 function MyDroneHook(scene) {
 	CGFobject.call(this,scene);
	
	this.cable = new MyCylinder(scene, 6, 3); 
	this.cableScale = 2;
	this.hookRadius = 0.15;
	this.hookLength = 0.25;
	//center bottom coordinates
	this.hookPosition = this.hookLength + (this.cableScale * 0.15);
	this.y = 0;
	this.z = 0;
	this.x = 0;
	this.hook = new MyCylinder(scene, 8, 4); 
 };

MyDroneHook.prototype = Object.create(CGFobject.prototype);
MyDroneHook.prototype.constructor = MyDroneHook;

MyDroneHook.prototype.display = function() {
	//cable
	this.scene.pushMatrix();
	this.scene.rotate(90 * degToRad, 1, 0, 0);
	this.scene.translate(0, 0, 0.25);
	this.scene.scale(1, 1, this.cableScale);
	this.scene.scale(0.10, 0.10, 0.15);
	this.cable.display();
	this.scene.popMatrix();

	//hook
    this.scene.pushMatrix();
	this.scene.rotate(90 * degToRad, 1, 0, 0);
	this.scene.translate(0, 0, this.hookPosition);
	this.scene.scale(0.30, 0.30, 0.25);
	this.hook.display();
	this.scene.popMatrix();
}

MyDroneHook.prototype.scaleHook = function(scale){
	var aux = this.hookPosition;
	this.cableScale += scale;
	if(this.cableScale < 0.15)
		this.cableScale = 0.15;
	this.hookPosition = this.hookLength + this.cableScale * 0.15 ;
	aux -= this.hookPosition;
	this.y += aux;
}

MyDroneHook.prototype.updateCoordinates = function(x, y, z){
	this.x = x;
	this.y = y - this.hookPosition - 0.25;
	this.z = z;
}