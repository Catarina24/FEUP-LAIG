/**
 * MyPrism
 * @constructor
 */
 function MyCylinder(scene, slices, stacks, height, base, top) {
 	CGFobject.call(this,scene);
	this.height=height;
	this.base = new MyCylinderBase(scene, slices, base);
	this.top = new MyCylinderBase(scene, slices, top);
	this.surface = new MyCylinderSurface(scene, slices, stacks, height, base, top);
 	this.initBuffers();
 };

 MyCylinder.prototype = Object.create(CGFobject.prototype);
 MyCylinder.prototype.constructor = MyCylinder;

 MyCylinder.prototype.display = function(){
 	this.surface.display();

 	//base
 	this.scene.pushMatrix();
 		this.scene.rotate(Math.PI, 0, 0, 1);
 		this.scene.rotate(Math.PI, 0, 1, 0);
 		this.base.display();
 	this.scene.popMatrix();

     //topo
 	this.scene.pushMatrix();
 		this.scene.translate(0, 0, this.height);
 		this.top.display();
 	this.scene.popMatrix();
 }

 