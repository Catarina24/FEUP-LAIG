
function XMLscene() {
    CGFscene.call(this);
}

XMLscene.prototype = Object.create(CGFscene.prototype);
XMLscene.prototype.constructor = XMLscene;

XMLscene.prototype.init = function (application) {
    CGFscene.prototype.init.call(this, application);

    this.initCameras();

    this.initLights();

    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);

    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
	this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);

	this.axis=new CGFaxis(this);

	//this.myInterface = new CGFinterface();
	//this.enableTextures(true);

	//declaração das variáveis do MySceneGraph
	this.cameras = [];
	this.textures = [];
	this.materials = [];
	this.primitives = [];


};

XMLscene.prototype.initLights = function () {

	this.lights[0].setPosition(2, 3, 3, 1);
    this.lights[0].setDiffuse(1.0,1.0,1.0,1.0);
    this.lights[0].setSpecular(1.0,1.0,1.0,1.0);
    this.lights[0].update();
	
};

XMLscene.prototype.initCameras = function () {
    this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
	
};

XMLscene.prototype.setDefaultAppearance = function () {
    this.setAmbient(0.2, 0.4, 0.8, 1.0);
    this.setDiffuse(0.2, 0.4, 0.8, 1.0);
    this.setSpecular(0.2, 0.4, 0.8, 1.0);
    this.setShininess(10.0);	
};

// Handler called when the graph is finally loaded. 
// As loading is asynchronous, this may be called already after the application has started the run loop
XMLscene.prototype.onGraphLoaded = function () 
{
	this.axis=new CGFaxis(this, this.graph.axis_length);
	
	this.gl.clearColor(this.graph.background[0],this.graph.background[1],this.graph.background[2],this.graph.background[3]);
	this.lights[0].setVisible(true);
    this.lights[0].enable();

	this.init_variables();
	//this.changeCamera(0);
};

XMLscene.prototype.init_variables = function(){
	this.cameras = this.graph.cameras;
	this.textures = this.graph.textures;
	this.materials = this.graph.materials;
	this.primitives = this.graph.primitives;

	
};


XMLscene.prototype.changeCamera = function(i){
	//verificação nao faz nada ??
	if (i >= this.cameras.length)
		return "i out of range";
	this.camera = new CGFcamera(this.cameras[i].angle, this.cameras[i].near, this.cameras[i].far, this.cameras[i].position, this.cameras[i].target);
	//this.myInterface.setActive(this.camera);
}



XMLscene.prototype.display = function () {
	// ---- BEGIN Background, camera and axis setup
	
	// Clear image and depth buffer everytime we update the scene
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

	// Initialize Model-View matrix as identity (no transformation
	this.updateProjectionMatrix();
    this.loadIdentity();

	// Apply transformations corresponding to the camera position relative to the origin
	this.applyViewMatrix();

	// Draw axis
	this.axis.display();

	this.setDefaultAppearance();
	
	// ---- END Background, camera and axis setup

	// it is important that things depending on the proper loading of the graph
	// only get executed after the graph has loaded correctly.
	// This is one possible way to do it
	if (this.graph.loadedOk)
	{
		this.lights[0].update();
		//this.lights[1].update();
	}

	
	this.processGraph(this.graph.sceneRoot);

};

/**FROM HERE ON THE FUNCTIONS ARE OURS**/

XMLscene.prototype.processGraph = function(nodeName)
{
	var material = null;

	if(nodeName != null)
	{
		var node = this.graph.nodes.get(nodeName);

		if(node.materials[0] != null)
		{
			material = node.materials[0];
		}
		
		if(material != null)
		{
			//this.applyMaterial(material);
		}

		this.multMatrix(node.mat);

		if(node.isPrimitive)
		{
			node.primitive.display();
		}
		
		else
		{
			for(var i = 0; i < node.children.length; i++)
			{
				this.pushMatrix();

				//this.applyMaterial(material);

				this.processGraph(node.children[i]);

				this.popMatrix();
			}
		}

	}
};
