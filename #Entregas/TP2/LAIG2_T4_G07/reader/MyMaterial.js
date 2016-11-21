/*
* MyMaterial class
*
* Used to parse the information of a dsx primitive and turn it into a scene material.
*/

/*
* MyMaterial constructor
* @param scene The current scene
*
*/
function MyMaterial(scene) {

    this.scene = scene;
	
	this.id=null;
	this.emission = [];
	this.ambient = [];
	this.diffuse = [];
	this.specular = [];
	this.shininess=null;
	
 };
 
MyMaterial.prototype = Object.create(CGFobject.prototype);
MyMaterial.prototype.constructor = MyMaterial;