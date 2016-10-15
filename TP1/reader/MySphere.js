/**
 * MySemiSphere
 * @constructor
 */
 function MySphere(scene, slices, stacks, radius) {
 	CGFobject.call(this,scene);
	
	this.slices = slices;
	this.stacks = stacks;
    this.radius = radius;

 	this.initBuffers();
 };

 //MODIICAR RAIO

MySphere.prototype = Object.create(CGFobject.prototype);
MySphere.prototype.constructor = MySphere;

 MySphere.prototype.initBuffers = function() {
 	
	this.vertices = [];
	this.normals = [];
	this.indices = [];
	//this.texCoords = [];

	var u = Math.PI/this.stacks;
 	var v = Math.PI*2/this.slices;
 	var x, y, z;
	var counter = 0;

	for(var i = 0; i <= this.stacks; i++){
		for(var j = 0; j <= this.slices; j++){

			//x e y dependem do raio
			x = Math.cos(j * v) * Math.sin(i*u) * this.radius;
			y = Math.cos(i * u) * this.radius;
			z = this.radius * Math.sin(j*v) * Math.sin(i*u);
			this.vertices.push(x, y, z);
			this.normals.push(x, y, z);
			//this.texCoords.push(1 - i / this.slices, 1 - j / this.stacks);
			counter++;
 		}
	}

	for(var i = 0; i < this.stacks; i++){
 		for(var j = 0; j < this.slices; j++)
 		{ 
			var stack1 = (i * (this.slices + 1)) + j;
			var stack2 = (i * (this.slices + 1)) + j + this.slices +1;

			this.indices.push(stack1, stack2 + 1, stack2);
			this.indices.push(stack1, stack1+1, stack2+1);
 		} 
	}

	//this.texCoords.push(0.5, 0.5);

 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };