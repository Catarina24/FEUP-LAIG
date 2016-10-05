/** 
* MyNode Class
* 
* Class that will be used to store a scene graph node information.
* The information in this node will generate a CGFobject.
**/

/**
* Constructor
*
* @attribute id             -- The id of the node in the DSX file
* @attribute children       -- An ARRAY with all the child nodes id
* @attribute material       -- The nodes material (use fathers if it is null)
* @attribute texture        -- The nodes texture (use fathers if it is null)
* @attribute transformations-- An ARRAY of tranformations to be multiplied by the fathers.
*/

function MyNode()
{
    this.id = null;
    this.children = [];
    this.material = null;
    this.texture = null;
    this.transformations = [];
};

MyNode.prototype.constructor = MyNode;  // defining which function is the constructor

MyNode.prototype.setId = function (id){
    this.id = id;
};

MyNode.prototype.setMaterial = function (material){
    this.material = material;
}

MyNode.prototype.setTexture = function (texture){
    this.texture = texture;
}

MyNode.prototype.pushChildNode = function (childNode){
    this.children.push(childNode);
}

MyNode.prototype.numOfChildren = function(){
    return this.children.length;
}

