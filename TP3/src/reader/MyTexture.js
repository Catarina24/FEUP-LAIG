/*
* MyTexture class
*
* Used to parse the information of a dsx primitive and turn it into a scene texture.
*/

/*
* MyTexture constructor
* @param scene The current scene
*
*/
function MyTexture(scene) {

    this.scene = scene;
	this.id = null;
	this.file=null;
	this.length_s=null;
	this.length_t=null;
	
 };
 
MyTexture.prototype = Object.create(CGFobject.prototype);
MyTexture.prototype.constructor = MyTexture;