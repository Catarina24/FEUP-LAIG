/**
 * MyQuad
 * @constructor
 */

 /* Desenvolvido durante CGRA */
 
 function MyTriangle(scene, x1, x2, x3, y1, y2, y3, z1, z2, z3) {
 	CGFobject.call(this,scene);

   	this.x1 = x1;
    this.x2=x2;
    this.x3=x3;
    this.y1 = y1;
    this.y2=y2;
    this.y3=y3;
    this.z1 = z1;
    this.z2=z2;
    this.z3=z3;
    
 	this.initBuffers();
 };

 MyTriangle.prototype = Object.create(CGFobject.prototype);
 MyTriangle.prototype.constructor = MyTriangle;

 MyTriangle.prototype.initBuffers = function() {
 	this.vertices = [
         this.x1, this.y1, this.z1,
         this.x2, this.y2, this.z2,
         this.x3, this.y3, this.z3

 	];

 	this.indices = [
 	0, 1, 2
 	];


 	this.primitiveType = this.scene.gl.TRIANGLES;

 	this.normals = [
 	  0, 0, 1,
 	  0, 0, 1,
 	  0, 0, 1
 	];

    
 	this.texCoords = [
 	0, 0, 
 	1, 0, 
    0, 1
 	];
 	
 	this.initGLBuffers();
 };