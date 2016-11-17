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
* @attribute children       -- The ARRAY with all the child nodes id
* @attribute material       -- The ARRAY of the nodes material (use fathers if it is null)
* @attribute texture        -- The nodes texture (use fathers if it is null)
* @attribute transformations-- The ARRAY of tranformations to be multiplied by the fathers.
* @attribute mat            -- The matrix with transformations.
* @attribute isPrimitive    -- True if this node represents a primitive. False otherwise.
* @attribute primitive      -- If the current node is a primitive it is the primitive object. Null otherwise.
*/

function MyNode(){
    
    this.id = null;
    this.children = [];
    this.materials = [];
    this.texture = null;
    
    this.mat = mat4.create();

    this.isPrimitive = false;
    this.primitive = null;
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

MyNode.prototype.push = function (childNode){
    this.children.push(childNode);
}

MyNode.prototype.numOfChildren = function(){
    return this.children.length;
}

MyNode.prototype.isPrimitive = function(){
    return this.isPrimitive;
}

MyNode.prototype.setMatrix = function(mat){
    this.mat = mat4.clone(mat);
}