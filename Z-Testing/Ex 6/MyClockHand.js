/**
 * MyClockHand
 * @constructor
 */
 function MyClockHand(scene, ySize, angle) {
 	CGFobject.call(this,scene);
 	this.ySize = ySize;
 	this.angle = angle;
    this.quad = new MyQuad(scene, 0, 1, 0, 1);
 };

MyClockHand.prototype = Object.create(CGFobject.prototype);
MyClockHand.prototype.constructor = MyClockHand;

MyClockHand.prototype.display = function() {
    this.scene.pushMatrix();
 	this.scene.scale(0.05, this.ySize, 0.2);
 	this.scene.translate(0, 0.5, 0.1);
 	this.quad.display();
 	this.scene.popMatrix();
}

MyClockHand.prototype.setAngle = function(angle){
  this.angle = angle;
  this.scene.rotate(-angle * degToRad, 0, 0, 1);
}
