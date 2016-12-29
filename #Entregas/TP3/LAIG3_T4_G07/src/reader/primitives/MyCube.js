/**
 * MyCube
 * @constructor
 */
 function MyCube(scene, dimension, partsX, partsY) {
 	CGFobject.call(this,scene);
    this.dimension = dimension;
    this.plane = new MyPlane(scene, this.dimension, this.dimension, partsX, partsY);
 	this.initBuffers();
 };

 MyCube.prototype = Object.create(CGFobject.prototype);
 MyCube.prototype.constructor = MyCube;

 MyCube.prototype.display = function(){
 	
    //front
    this.scene.pushMatrix();
        this.scene.translate(0, 0, this.dimension/2);
 		this.plane.display();
 	this.scene.popMatrix();

    //back
    this.scene.pushMatrix();
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.scene.translate(0, 0, this.dimension/2);
 		this.plane.display();
 	this.scene.popMatrix();

    //right
    this.scene.pushMatrix();
        this.scene.rotate(Math.PI/2, 0, 1, 0);
        this.scene.translate(0, 0, this.dimension/2);
 		this.plane.display();
 	this.scene.popMatrix();

    //left
    this.scene.pushMatrix();
        this.scene.rotate(-Math.PI/2, 0, 1, 0);
        this.scene.translate(0, 0, this.dimension/2);
 		this.plane.display();
 	this.scene.popMatrix();

    //up
    this.scene.pushMatrix();
        this.scene.rotate(-Math.PI/2, 1, 0, 0);
        this.scene.translate(0, 0, this.dimension/2);
 		this.plane.display();
 	this.scene.popMatrix();

    //down
    this.scene.pushMatrix();
        this.scene.rotate(Math.PI/2, 1, 0, 0);
        this.scene.translate(0, 0, this.dimension/2);
 		this.plane.display();
 	this.scene.popMatrix();
 }