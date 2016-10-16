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
 	this.x1, this.y2, 0,
 	this.x2, this.y2, 0,
 	this.x1, this.y1, 0,
 	this.x2, this.y1, 0,
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

 	this.texCoords=[];

	/*for (var i=0; i<=this.x2; i++){
		for(var j=0; j<=this.y2; j++){
			this.texCoords.push(i, j);
		}
	}*/
    
 	this.texCoords = [
 	this.minS, this.maxT, 
 	this.maxS, this.maxT, 
    this.minS, this.minT, 
 	this.maxS, this.minT
 	];

 	this.initGLBuffers();
 };