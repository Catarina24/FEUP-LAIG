
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

	//Interface variables declaration

	this.light0 = true;
	this.light1 = true;

	// Complete with following lights

};

XMLscene.prototype.initLights = function () {

	this.lights[0].setPosition(2, 3, 3, 0.5);
    this.lights[0].setDiffuse(1.0,1.0,1.0,0.5);
    this.lights[0].setSpecular(1.0,1.0,1.0,0.5);
    this.lights[0].update();
	
};

XMLscene.prototype.initCameras = function () {
    this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));
	
};

XMLscene.prototype.setDefaultAppearance = function () {
    this.setAmbient(0.5, 0.4, 0.8, 1.0);
    this.setDiffuse(0.9, 0.4, 0.8, 1.0);
    this.setSpecular(0.9, 0.4, 0.8, 1.0);
    this.setShininess(1.0);	
};

// Handler called when the graph is finally loaded. 
// As loading is asynchronous, this may be called already after the application has started the run loop
XMLscene.prototype.onGraphLoaded = function () 
{
	this.axis=new CGFaxis(this, this.graph.axis_length);
	
	this.gl.clearColor(this.graph.background[0],this.graph.background[1],this.graph.background[2],this.graph.background[3]);
	//this.lights[0].setVisible(true);
    //this.lights[0].enable();

	this.init_variables();
	//this.changeCamera(0);
	this.updateLights();

	console.log(this.graph.nodes);
};

XMLscene.prototype.init_variables = function(){
	this.cameras = this.graph.cameras;
	this.textures = this.graph.textures;
	this.materials = this.graph.materials;
	this.primitives = this.graph.primitives;
	
	console.log(this.lights);
};


XMLscene.prototype.updateLights = function(){
	/*this.lights[0].setPosition(2, 3, 3, 0.5);
    this.lights[0].setDiffuse(1.0,1.0,1.0,0.5);
    this.lights[0].setSpecular(1.0,1.0,1.0,0.5);
    this.lights[0].update();*/

    for (var i=0; i<this.graph.lights.length; i++){
			

    	//spot lights
    	if (this.graph.lights[i].omni != true){

 			//target
			var x= this.graph.lights[i].target[0];
			var y= this.graph.lights[i].target[1];
			var z= this.graph.lights[i].target[2];

			this.lights[i].setSpotDirection(x, y, z);

			//angle
			var angle= this.graph.lights[i].angle;

			this.lights[i].setSpotCutOff(angle);

			//Exponent
			var n= this.graph.lights[i].exponent;

			this.lights[i].setSpotCutOff(n);

			console.log(this.lights[i]);
    	}

    	//common properties


		//location
    	var x= this.graph.lights[i].location[0];
		var y= this.graph.lights[i].location[1];
		var z= this.graph.lights[i].location[2];
		var w= this.graph.lights[i].location[3];
		this.lights[i].setPosition(x, y, z, w);

    	var r, g, b, a;

		//ambient
		r= this.graph.lights[i].ambientRGBA[0];
		g= this.graph.lights[i].ambientRGBA[1];
		b= this.graph.lights[i].ambientRGBA[2];
		a= this.graph.lights[i].ambientRGBA[3];

		this.lights[i].setAmbient(r, g, b, a);

		//diffuse
		r= this.graph.lights[i].diffuseRGBA[0];
		g= this.graph.lights[i].diffuseRGBA[1];
		b= this.graph.lights[i].diffuseRGBA[2];
		a= this.graph.lights[i].diffuseRGBA[3];

		this.lights[i].setDiffuse(r, g, b, a);


		//specular
		r= this.graph.lights[i].specularRGBA[0];
		g= this.graph.lights[i].specularRGBA[1];
		b= this.graph.lights[i].specularRGBA[2];
		a= this.graph.lights[i].specularRGBA[3];

		this.lights[i].setSpecular(r, g, b, a);

		//enable lights
		if (this.graph.lights[i].enabled == 1){
			this.lights[i].setVisible();
			this.lights[i].enable();
		}

		this.lights[i].update();
    }
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
		//this.lights[0].update();
		//this.lights[1].update();
	}

	var myCylinder = new MyCylinder(this, 30, 20, 6, 0.5, 0.5);
	//myCylinder.display();
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
			//this.apply(material);
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
