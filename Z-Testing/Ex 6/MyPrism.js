/**
 * MyPrism
 * @constructor
 */
 function MyPrism(scene, slices, stacks) {
 	CGFobject.call(this,scene);
	
	this.slices = slices;
	this.stacks = stacks;

 	this.initBuffers();
 };

 MyPrism.prototype = Object.create(CGFobject.prototype);
 MyPrism.prototype.constructor = MyPrism;

 MyPrism.prototype.initBuffers = function() {
 	/*
 	* TODO:
 	* Replace the following lines in order to build a prism with a **single mesh**.
 	*
 	* How can the vertices, indices and normals arrays be defined to
 	* build a prism with varying number of slices and stacks?
 	*/
	this.vertices = [];
	this.normals = [];
	this.indices = [];
 	var ang = Math.PI*2/this.slices;
 	var x, y;

	for(var j = 0; j <= this.stacks; j++){
		for(var i = 0; i < this.slices; i++){
			//posição x e y dos dois vértices de uma mesma face
			x1 = Math.cos(i * ang); 
			y1 = Math.sin(i * ang); 
			x2 = Math.cos((i + 1) * ang); 
			y2 = Math.sin((i + 1) * ang);


			this.vertices.push(x1, y1, j / this.stacks);
			this.normals.push(i * ang + ang / 2, i * ang + ang/2, 0);
			
			this.vertices.push(x2, y2, j / this.stacks);
			this.normals.push(i * ang + ang / 2, i * ang + ang/2, 0);
 		}
	}

	for(var j = 0; j < this.stacks; j++){
 		for(var i = 0; i < this.slices; i++){
 			this.indices.push((i * 2) + this.slices * 2 * j, i * 2 + 1 + this.slices * 2 * j, (i * 2) + this.slices * 2 + this.slices * 2 * j)
 			this.indices.push(i*2 + 1 + this.slices * 2 * j, this.slices * 2 + i*2 + 1 + this.slices * 2 * j, (i * 2) + this.slices * 2 + this.slices * 2 * j);
 		} 
	}

 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };
