/**
 * MyTable
 * @param gl {WebGLRenderingContext}
 * @constructor
 */
function MyTable(scene) {
	CGFobject.call(this,scene);

	this.cubequad = new MyUnitCubeQuad(this.scene, 0, 1, 0, 1);
	this.tableAppearance = new CGFappearance(scene);
 	this.tableAppearance.loadTexture("../resources/images/table.png")
 	this.tableAppearance.setDiffuse(0.9, 0.9, 0.9,1);
	this.tableAppearance.setSpecular(0.2, 0.2, 0.2,1);	
	this.tableAppearance.setShininess(15);
	
	this.greyAppearance= new CGFappearance(scene);
	this.greyAppearance.loadTexture("../resources/images/Grey.jpg")	
	this.greyAppearance.setDiffuse(0.9, 0.9, 0.9,1);
	this.greyAppearance.setSpecular(0.2, 0.2, 0.2,1);	
	this.greyAppearance.setShininess(30);
};

MyTable.prototype = Object.create(CGFobject.prototype);
MyTable.prototype.constructor=MyTable;

MyTable.prototype.display = function () {
	//legs
	this.greyAppearance.apply();
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

	
	this.scene.pushMatrix();
	this.scene.translate(2.35, 3.5, 1.35);
	this.scene.scale(5, 0.3, 3);
	this.scene.translate(0, 0.5, 0);
	this.tableAppearance.apply();
    this.cubequad.display();
    this.scene.popMatrix();
   
  	 this.scene.materialDefault.apply();
    
}