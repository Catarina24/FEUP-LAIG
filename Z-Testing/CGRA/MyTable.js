/**
 * MyTable
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
function MyTable(scene) {
	CGFobject.call(this,scene);

	this.cubequad = new MyUnitCubeQuad(this.scene);

};

MyTable.prototype = Object.create(CGFobject.prototype);
MyTable.prototype.constructor=MyTable;

MyTable.prototype.display = function () {
	this.scene.pushMatrix();
	this.scene.scale(0.3, 3.5, 0.3);
	this.scene.translate(0, 0.5, 0);
    this.cubequad.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
	this.scene.translate(4.7, 0, 2.70);
	this.scene.scale(0.3, 3.5, 0.3);
	this.scene.translate(0, 0.5, 0);
    this.cubequad.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
	this.scene.translate(0, 0, 2.7);
	this.scene.scale(0.3, 3.5, 0.3);
	this.scene.translate(0, 0.5, 0);
    this.cubequad.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
	this.scene.translate(4.7, 0, 0);
	this.scene.scale(0.3, 3.5, 0.3);
	this.scene.translate(0, 0.5, 0);
    this.cubequad.display();
    this.scene.popMatrix();

	this.scene.animation.apply(this.scene.elapsedTime);
	this.scene.pushMatrix();
	this.scene.translate(2.35, 3.5, 1.35);
	this.scene.scale(5, 0.3, 3);
	this.scene.translate(0, 0.5, 0);
    this.cubequad.display();
    this.scene.popMatrix();
   
    
}