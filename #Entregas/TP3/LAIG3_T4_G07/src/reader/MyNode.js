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
* @attribute matrix         -- A matrix with transformations.
*/

function MyNode(){
    
    this.id = null;
    this.children = [];
    this.materials = [];

    // Animations
    this.animations = [];

    this.cumulativeAnimationTimes = [];
    this.allAnimationsTime = 0;

    this.numAnimations = 0;
    this.time = 0;

    this.texture = null;
    
    this.mat = mat4.create();

    this.localMatrix = mat4.create();
    this.worldMatrix = mat4.create();

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

MyNode.prototype.updateWorldMatrix = function (parentWorldMatrix){
    if(parentWorldMatrix)   // if there is a matrix to be applied
    {
        mat4.multiply(this.worldMatrix, this.localMatrix, parentWorldMatrix);
    }
    else    // apply node matrix
    {
        this.worldMatrix = mat4.clone(this.localMatrix);
    }

    // process childrens matrix
    var worldMatrix = this.worldMatrix;
    this.children.forEach(function(child){
        child.updateWorldMatrix(worldMatrix);
    });

}

MyNode.prototype.isPrimitive = function(){
    return this.isPrimitive;
}

MyNode.prototype.setMatrix = function(mat){
    this.mat = mat4.clone(mat);
}

MyNode.prototype.calculateCumulativeAnimationTimes = function(scene)
{
    for(var i = 0; i < this.animations.length; i++)
    {
        this.allAnimationsTime += scene.animations[this.animations[i]].totalTime;
        this.cumulativeAnimationTimes.push(this.allAnimationsTime);
    } 
}

MyNode.prototype.applyAnimation = function(scene, elapsedTime){

    var currentAnimationTime = elapsedTime;

    var currentAnimationIndex = 0;

    while(1)
    {
        if(elapsedTime > this.cumulativeAnimationTimes[currentAnimationIndex])
        {
            scene.animations[this.animations[currentAnimationIndex]].endAnimation(this);
            currentAnimationIndex++;
        }
        else
        {
            if(currentAnimationIndex > 0)
            {
                currentAnimationTime = elapsedTime - this.cumulativeAnimationTimes[currentAnimationIndex-1];
            }
            break;
        }
    }

    if(currentAnimationIndex < this.animations.length)
    {
        scene.animations[this.animations[currentAnimationIndex]].apply(currentAnimationTime, this);
    }
}