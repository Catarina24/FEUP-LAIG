/**
 * MyQuad
 * @constructor
 */

 /* Desenvolvido durante CGRA */
 
 function MyQuad(scene, minS, maxS, minT, maxT) {
 	CGFobject.call(this,scene);
   	this.minS = minS;
 	this.maxS = maxS;
 	this.minT = minT;
 	this.maxT = maxT;
 	this.initBuffers();
 };

 MyQuad.prototype = Object.create(CGFobject.prototype);
 MyQuad.prototype.constructor = MyQuad;

 MyQuad.prototype.initBuffers = function() {
 	this.vertices = [
 	-0.5, 0.5, 0,
 	0.5, 0.5, 0,
 	-0.5, -0.5, 0,
 	0.5, -0.5, 0,
 	];

 	this.indices = [
 	0, 2, 3,
 	3, 1, 0
 	];


 	this.primitiveType = this.scene.gl.TRIANGLES;

 	this.normals = [
 	  0, 0, 1,
 	  0, 0, 1,
 	  0, 0, 1,
 	  0, 0, 1
 	];

    this
 	this.texCoords = [
 	this.minS, this.minT, 
 	this.maxS, this.minT, 
    this.minS, this.maxT, 
 	this.maxS, this.maxT
 	];


 	
 	this.initGLBuffers();
 };