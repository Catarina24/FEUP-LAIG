/**
 * MyCircle
 * @constructor
 */
 function MyCircle(scene, slices, stacks) {
 	CGFobject.call(this,scene);
	
	this.slices = slices;
	this.stacks = stacks;
 	this.initBuffers();
 };

MyCircle.prototype = Object.create(CGFobject.prototype);
MyCircle.prototype.constructor = MyCircle;

 MyCircle.prototype.initBuffers = function() {
 	
	this.vertices = [0, 0, 1,];
	this.normals = [0, 0, 1,];
	this.indices = [];
	this.texCoords = [0.5, 0.5,];

	var ang = Math.PI*2/this.slices;
 	var x, y;

	for(var i = 0; i < this.slices; i++){
		//posição x e y dos dois vértices de uma mesma face
		x = Math.cos(i * ang); 
		y = Math.sin(i * ang);

		this.vertices.push(x, y, 1);
		this.normals.push(Math.cos(i * ang + ang / 2), Math.sin(i * ang + ang/2), 1);
		this.texCoords.push(x/2 +0.5,y/2 + 0.5);
	}

	for(var i = 1; i <= this.slices; i++){
	    if(i == this.slices){this.indices.push(i, 1, 0)}
 			else this.indices.push(i, i+1, 0);
 	} 


 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };
 