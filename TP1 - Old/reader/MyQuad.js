/**
 * MyQuad
 * @constructor
 */

 /* Desenvolvido durante CGRA */
 
function MyQuad(scene, x1, x2, y1, y2) {
 	CGFobject.call(this,scene);
	this.x1=x1;
	this.x2=x2;
	this.y1=y1;
	this.y2=y2;
   	this.minS = 0;
 	this.maxS = 1;
 	this.minT = 0;
 	this.maxT = 1;
	 
 	this.initBuffers();
 };

 MyQuad.prototype = Object.create(CGFobject.prototype);
 MyQuad.prototype.constructor = MyQuad;

 MyQuad.prototype.initBuffers = function() {
 	this.vertices = [
		this.x1, this.y1, 0,
		this.x2, this.y1, 0,
		this.x2, this.y2, 0,
		this.x1, this.y2, 0,
 	];

 	this.indices = [
 	0, 1, 3,
 	1, 2, 3
 	];


 	this.primitiveType = this.scene.gl.TRIANGLES;

 	this.normals = [
 	  0, 0, 1,
 	  0, 0, 1,
 	  0, 0, 1,
 	  0, 0, 1
 	];

 	this.texCoords=[];

 	this.texCoords = [
		this.minS, this.maxT, 
		this.maxS, this.maxT, 
		this.maxS, this.minT, 
		this.minS, this.minT
 	];

 	this.initGLBuffers();
 };