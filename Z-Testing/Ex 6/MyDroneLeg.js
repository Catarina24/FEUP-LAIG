/**
 * MyDroneLeg
 * @constructor
 */
 function MyDroneLeg(scene) {
 	CGFobject.call(this,scene);
	
	this.base = new MyUnitCubeQuad(scene, 0, 1, 0, 1);

	// Arch parameteres
	p0 = [0,0];
	p1 = [1,0];
	p = [0.5, 1];
	width = 0.05;
	this.arch = new MyArch(scene, p0, p1, p, width);
 };

MyDroneLeg.prototype = Object.create(CGFobject.prototype);
MyDroneLeg.prototype.constructor = MyDroneLeg;

MyDroneLeg.prototype.display = function() {
	//Legs
	//Right leg base
	this.scene.pushMatrix();
	this.scene.translate(1.5, -2, 0)
	this.scene.rotate(-90 * degToRad, 0, 1, 0)
	this.scene.scale(2, 0.15, 0.15);
	this.base.display();
	this.scene.popMatrix();

	//Left leg base
	this.scene.pushMatrix();
	this.scene.translate(-1.5, -2, 0)
	this.scene.rotate(-90 * degToRad, 0, 1, 0)
	this.scene.scale(2, 0.15, 0.15);
	this.base.display();
	this.scene.popMatrix();

	//Arches

	//North arch (lower Z)
	this.scene.pushMatrix();
	this.scene.translate(-1.5, -2, -0.5);
	this.scene.scale(3, 3.5, 2);
	this.arch.display();
	this.scene.popMatrix();

	//South arch (higher Z)
	this.scene.pushMatrix();
	this.scene.translate(-1.5, -2, 0.5);
	this.scene.scale(3, 3.5, 2);
	this.arch.display();
	this.scene.popMatrix();
}

MyDroneLeg.prototype.setTexture = function(newTexture){
	this.legAppearance.loadTexture(newTexture);
}