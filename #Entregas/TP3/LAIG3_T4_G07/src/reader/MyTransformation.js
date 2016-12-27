/*
* MyTransformation class
*
* Used to parse the information of a dsx primitive and turn it into a scene material.
*/

/*
* MyTransformation constructor
* @param scene The current scene
*
*/
function MyTransformation(scene) {

    this.scene = scene;
	
	this.id=null;
	this.matrix=null;
	
 };
 
MyTransformation.prototype = Object.create(CGFobject.prototype);
MyTransformation.prototype.constructor = MyTransformation;