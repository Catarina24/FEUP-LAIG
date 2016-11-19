/**
 * MyCargo
 * @constructor
 */
 function MyCargo(scene, x, y, z) {
 	CGFobject.call(this,scene);
	this.cargo = new MyUnitCubeQuad(scene, 0, 1, 0, 1); 
	//center coordinates
    this.X = x;
    this.Y = y;
    this.Z = z;
    
    this.paperAppearance = new CGFappearance(scene);
	this.paperAppearance.loadTexture("../resources/images/Paper.jpg");
	this.paperAppearance.setDiffuse(0.3, 0.3, 0.3,1);
	this.paperAppearance.setSpecular(0.6, 0.6, 0.6,1);	
	this.paperAppearance.setShininess(120);
 };

MyCargo.prototype = Object.create(CGFobject.prototype);
MyCargo.prototype.constructor = MyCargo;

MyCargo.prototype.display = function() {
	this.scene.pushMatrix();
	this.scene.translate(this.X, this.Y, this.Z);
    this.paperAppearance.apply();
	this.cargo.display();
	this.scene.popMatrix();
}

MyCargo.prototype.updateCoordinates = function(xInc, yInc, zInc) {
	this.X += xInc;
	this.Y = yInc;
	this.Z += zInc;
}