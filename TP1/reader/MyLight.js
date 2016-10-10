/** 
* MyLight Class
* 
* Class that will be used to store a scene graph light information.
* The information in this node will generate a CGFlight.
**/

function MyLight(scene)
{
    this.id = null;
    this.omni = false;
    this.enable = false;
    this.location = [];
    this.ambientRGBA = [];
    this.diffuseRGBA = [];
    this.specularRGBA = [];

    this.scene = scene;
};

MyLight.prototype.constructor = MyLight;

MyLight.prototype.myLightToCGFlight = function()
{
    var cgf = new CGFlight(this.scene, this.id);

    if(this.enable)
        cgf.enable();
    else
        cgf.disable();
     
    
    cgf.setAmbient(this.ambientRGBA[0],this.ambientRGBA[1], this.ambientRGBA[2], this.ambientRGBA[3]);
    cgf.setDiffuse(this.diffuseRGBA[0],this.diffuseRGBA[1], this.diffuseRGBA[2], this.diffuseRGBA[3]);
    cgf.setSpecular(this.specularRGBA[0],this.specularRGBA[1], this.specularRGBA[2], this.specularRGBA[3]);

    cgf.setPosition(this.location[0], this.location[1], this.location[2], this.location[3]);

    return cgf;
}