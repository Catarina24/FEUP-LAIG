/**
 * MyCylinderBase
 * @constructor
 */
 function MyCylinderBase(scene, slices, radius) {
 	CGFobject.call(this,scene);
	
	this.slices = slices;
    this.radius = radius;
 	this.initBuffers();
 };

 MyCylinderBase.prototype = Object.create(CGFobject.prototype);
 MyCylinderBase.prototype.constructor = MyCylinderBase;

 MyCylinderBase.prototype.initBuffers = function() {


	this.vertices =[];
	this.indices = [];
	//this.normals = [];
	//this.texCoords = [];

	
	var angle = 2 * Math.PI / (this.slices);
	var x, y;
	this.vertices.push(0,0,0);

	for (var i = 0; i<= this.slices; i++){
		x= this.radius*Math.cos(angle*i);
		y = this.radius*Math.sin(angle*i);
		this.vertices.push(x, y,0);
		//this.normals.push(1,0,0);

		if (i == this.slices)
			this.indices.push(0, i, 1);
		else
			this.indices.push(0, i, i+1);
	}

 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
}