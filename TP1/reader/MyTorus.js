/**
 * MyQuad
 * @constructor
 */

 /* Desenvolvido durante CGRA */
 
 function MyTorus(scene, inner, outer, slices, loops) {
 	CGFobject.call(this,scene);
   	
    this.inner = inner;
    this.outer = outer;
    this.slices = slices;
    this.loops = loops;
       
 	this.initBuffers();
 };

 MyTorus.prototype = Object.create(CGFobject.prototype);
 MyTorus.prototype.constructor = MyTorus;

 MyTorus.prototype.initBuffers = function() {
 	
    this.vertices = [];
    this.indices = [];
    this.normals = [];


    var v = 2*Math.PI/this.loops;
    var u = 2*Math.PI/this.slices;
    var x, y, z;

    for (var i=0; i <= this.loops; i++){
        
        for (var j=0; j<=this.slices; j++){
            x = (this.outer + this.inner * Math.cos(i*v)) * Math.cos(j*u);
            y = (this.outer + this.inner * Math.cos(i*v)) * Math.sin(j*u);
            z = this.inner * Math.sin(i*v);

            this.vertices.push(x, y, z);
            this.normals.push(x, y, z);

            }
    }


    for (var i=0; i < this.loops; i++){
        
        for (var j=0; j<this.slices; j++){
           
            this.indices.push(i*(this.slices+1)+j, i*(this.slices+1)+j+1, (i+1)*(this.slices+1)+j);
            this.indices.push(i*(this.slices +1) +j+1, (i+1)*(this.slices+1)+j+1, (i+1)*(this.slices+1)+j);
      
            }
    }

      

 	this.primitiveType = this.scene.gl.TRIANGLES;
 	this.initGLBuffers();
 };