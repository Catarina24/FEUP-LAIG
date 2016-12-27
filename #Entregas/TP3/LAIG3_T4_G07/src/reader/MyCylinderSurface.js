/**
 * MyPrism
 * @constructor
 */
 function MyCylinderSurface(scene, slices, stacks, height, base, top) {
 	CGFobject.call(this,scene);
	
	this.slices = slices;
	this.stacks = stacks;
    this.height = height;
    this.top = top;
    this.base = base;

 	this.initBuffers();
 };

 MyCylinderSurface.prototype = Object.create(CGFobject.prototype);
 MyCylinderSurface.prototype.constructor = MyCylinderSurface;

 MyCylinderSurface.prototype.initBuffers = function() {
 	
	this.vertices = [];
	this.normals = [];
	this.indices = [];
	this.texCoords = [];

 	var x, y;
 	var counter = 0;
    var ang = Math.PI*2/this.slices;
    var radiusRatio = (this.base - this.top) / this.stacks;
    var heightRatio = this.height / this.stacks;

	for(var i = 0; i <= this.stacks; i++){
        	
        var z = i*heightRatio;
        var r = this.base-i*radiusRatio;
       
		for(var j = 0; j <= this.slices; j++){
			//posição x e y dos dois vértices de uma mesma face
			x = r*Math.cos(j * ang); 
			y = r*Math.sin(j * ang);

			this.vertices.push(x, y, z);
			this.normals.push(x, y, 0);
			this.texCoords.push(j / this.slices, i / this.stacks); 
			counter++;	
		}
	}

	for(var i = 0; i < this.stacks; i++){
 		for(var j = 0; j < this.slices; j++)
 		{
			var stack1 = ((this.slices+1) * i) + j;
			var stack2 = ((this.slices+1) * i) + j + this.slices + 1;

			this.indices.push(stack1, stack2 + 1, stack2);
			this.indices.push(stack1, stack1 + 1, stack2 + 1);
 		}  
	}

 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };