/*
* MyShape class
*
* Used to parse the information of a dsx primitive and turn it into a scene shape.
* Either a rectangle, triangle, sphere, torus or cylinder.
*/

/*
* MyShapes constructor
* @param scene The current scene
* @param shapeNode The node corresponding to the shape being processed
*/
function MyShape(scene, shapeNode) {

    this.scene = scene;
    this.shape = shapeNode;

 };

MyShape.prototype = Object.create(CGFobject.prototype);
MyShape.prototype.constructor = MyShape;