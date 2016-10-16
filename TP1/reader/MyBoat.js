/**
 * MyBoat
 * @constructor
 */
 function MyBoat(scene, width, height) {
 	CGFobject.call(this,scene);

 	this.width=width;
 	this.height=height;

	this.cylinder = new MyCylinder(scene, 3, 1, width, height, height);

	this.cylinder2 = new MyCylinder(scene, 40, 10, 7*width/8, height/15, height/15);
	
	this.triangle = new MyTriangle(scene, 0, 0,0, -width/15, width/15, 0, 0, 0, height/2);
	
	var aux = Math.cos(Math.PI/6)*height;
	this.aux=aux;
	this.aux2=Math.sin(Math.PI/6)*height;
	var size = this.aux2+height;
	this.size=size;
	this.triangle2 = new MyTriangle(scene, 0, -aux, aux, 0, size, size, 0, 0, 0);
	
	var lado = Math.sqrt(size*size+size*size);

	//this.triangle3 = new MyTriangle(scene, 0, size, 0, 0, 0, size, 0, 0, 0);
	

	this.initBuffers();
 };

 MyBoat.prototype = Object.create(CGFobject.prototype);
 MyBoat.prototype.constructor = MyBoat;

 MyBoat.prototype.display = function() {

 	/*this.scene.pushMatrix();
 		//this.scene.translate(this.width, this.height/2, this.height);
 		this.scene.rotate(Math.PI/6, 1, 1, 0);
 		this.scene.rotate(3*Math.PI/2, 0, 0, 1);
		this.triangle3.display(); 
 	this.scene.popMatrix();*/

 	this.scene.pushMatrix();
 		this.scene.translate(this.width+this.size, this.aux2 , 0);
 		this.scene.rotate(Math.PI/2, 0, 0, 1);
 		this.scene.rotate(3*Math.PI/2, 0, 1, 0);
		this.triangle2.display(); 
 	this.scene.popMatrix();

 	this.scene.pushMatrix();
 		this.scene.translate(this.width/3, 10*this.width/11, 0);
 		this.scene.rotate(3*Math.PI/2, 0, 1, 0);
 		this.scene.rotate(Math.PI, 1, 0, 0);
		this.triangle.display(); 
 	this.scene.popMatrix();

 	this.scene.pushMatrix();
 		this.scene.translate(this.width/3, 0, 0);
 		this.scene.rotate(Math.PI/2, 0, 1, 0);
 		this.scene.translate(0, 10*this.width/11, 0);
		this.triangle.display(); 
 	this.scene.popMatrix();

 	this.scene.pushMatrix();
 		this.scene.translate(this.width/3, this.height/2, 0);
 		this.scene.rotate(3*Math.PI/2, 1, 0, 0);
		this.cylinder2.display();
 	this.scene.popMatrix();

	this.scene.pushMatrix();
		this.scene.rotate(3*Math.PI/2, 1, 0, 0);
		this.scene.rotate(Math.PI/2, 0, 1, 0);
 		this.cylinder.display();
 	this.scene.popMatrix();
	
}