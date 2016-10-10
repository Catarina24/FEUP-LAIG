/** 
* MyLight Class
* 
* Class that will be used to store a scene graph light information.
* The information in this node will generate a CGFlight.
**/

function MyLight()
{
    this.id = null;
    this.children = [];
    this.material = null;
    this.texture = null;
    this.transformations = [];
    this.isPrimitive = false;
};