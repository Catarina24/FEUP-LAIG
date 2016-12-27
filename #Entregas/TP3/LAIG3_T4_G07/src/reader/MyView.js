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
	this.position=null;
	this.target=null;
	
 };
 
MyView.prototype = Object.create(CGFobject.prototype);
MyView.prototype.constructor = MyView;

MyView.prototype.myViewToCGFcamera = function(){
	var aux = new CGFcamera(this.angle, this.near, this.far, this.position, this.target);
	
	return aux;
}