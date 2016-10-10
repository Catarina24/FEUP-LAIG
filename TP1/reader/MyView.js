/*
* MyView class
*
* Used to parse the information of a dsx primitive and turn it into a scene view.
*/

/*
* MyView constructor
* @param scene The current scene
*
*/
function MyView(scene) {

    this.scene = scene;
	
	this.id = null;
	this.near=null;
	this.far=null;
	this.angle=null;
	this.from_=[];
	this.to=[];
	
 };
 
MyShape.prototype = Object.create(CGFobject.prototype);
MyShape.prototype.constructor = MyView;