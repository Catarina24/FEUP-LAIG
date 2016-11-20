/**
 * MyDroneHelice
 * @constructor
 */
 function MyDroneHelice(scene) {
 	CGFobject.call(this,scene);
	
	this.center = new MySemiSphere(scene, 8, 4); 
	this.spade = new MyCylinder(scene, 8, 1); 
	this.angle = 180;
	this.speed = 1 * 360;
	this.auxAngle = this.angle;
 };

MyDroneHelice.prototype = Object.create(CGFobject.prototype);
MyDroneHelice.prototype.constructor = MyDroneHelice;

MyDroneHelice.prototype.display = function() {
	//spade
    this.scene.pushMatrix();
    this.scene.rotate(this.angle * degToRad, 0,1, 0)
	this.scene.translate(0, 0.15, 0);
	this.scene.scale(1.5, 0.05, 0.25);
	this.scene.rotate(-90 * degToRad, 1, 0, 0)
	this.spade.display();
	this.scene.popMatrix();
	
	//Center
	this.scene.pushMatrix();
	this.scene.scale(0.20, 0.30, 0.20);
	this.scene.rotate(-90 * degToRad, 1, 0, 0)
	this.center.display();
	this.scene.popMatrix();
}

MyDroneHelice.prototype.update = function(angle){
	this.auxAngle += angle - this.auxAngle;
	this.angle = this.auxAngle * this.speed;
}

MyDroneHelice.prototype.setRotationSpeed = function(speed) {
	this.speed = speed;}