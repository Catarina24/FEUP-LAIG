
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
	this.enableTextures(true);

	//declaração das variáveis do MySceneGraph
	this.cameras = [];
	this.textures = [];
	this.materials = [];
	this.primitives = [];

	//Interface variables declaration
	this.application = application;

	this.numOfLights = 0;

	// see @ loadLights to see how lights are activated/deactivated

	this.materialCounter = 0;
	this.viewCounter = 0;
	
	
	// Complete with following lights

	console.log(this);

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
	this.lights[0].setVisible(true);
    this.lights[0].enable();

	this.init_variables();
	this.changeCamera(0);
	this.updateLights();
	
	this.loadMaterials();
	this.loadTextures();
	this.loadLights();

	console.log(this.graph);
	console.log(this.cameras);
};

XMLscene.prototype.init_variables = function(){
	this.cameras = this.graph.cameras;

	this.primitives = this.graph.primitives;
};


XMLscene.prototype.loadMaterials = function(){
	for (var i=0; i <this.graph.materials.length; i++){

		var id=this.graph.materials[i].id;
		this.materials[id] = new CGFappearance(this);

		var r, g, b, a;
		
		//ambient
		r = this.graph.materials[i].ambient[0];
		g = this.graph.materials[i].ambient[1];
		b = this.graph.materials[i].ambient[2];
		a = this.graph.materials[i].ambient[3];

		this.materials[id].setAmbient(r, g, b, a);

		//diffuse
		r = this.graph.materials[i].diffuse[0];
		g = this.graph.materials[i].diffuse[1];
		b = this.graph.materials[i].diffuse[2];
		a = this.graph.materials[i].diffuse[3];

		this.materials[id].setDiffuse(r, g, b, a);

		//specular
		r = this.graph.materials[i].specular[0];
		g = this.graph.materials[i].specular[1];
		b = this.graph.materials[i].specular[2];
		a = this.graph.materials[i].specular[3];

		this.materials[id].setSpecular(r, g, b, a);

		//emission
		r = this.graph.materials[i].emission[0];
		g = this.graph.materials[i].emission[1];
		b = this.graph.materials[i].emission[2];
		a = this.graph.materials[i].emission[3];

		this.materials[id].setEmission(r, g, b, a);

		//shininess
		s = this.graph.materials[i].shininess;

		this.materials[id].setShininess(s);
	}
};

XMLscene.prototype.loadTextures = function(){
	for (var i=0; i <this.graph.textures.length; i++){

		var id=this.graph.textures[i].id;
		var url = this.graph.textures[i].file;
		this.textures[id] = new CGFtexture(this, url);

		var length_s, length_t;
		
		//PROBLEMA - RESOLVER
		length_s = this.graph.textures[i].length_s;
		length_t = this.graph.textures[i].length_t;
	
	}
};


XMLscene.prototype.loadLights = function()
{
	for (var i=0; i<this.graph.lights.length; i++){
    	//spot lights
    	if (this.graph.lights[i].omni != true){

 			//target
			var x= this.graph.lights[i].target[0];
			var y= this.graph.lights[i].target[1];
			var z= this.graph.lights[i].target[2];

			this.lights[i].setSpotDirection(x, y, z);

			//angle
			var angle= (2*Math.PI)/360 * this.graph.lights[i].angle;

			this.lights[i].setSpotCutOff(angle);

			//Exponent
			var n= this.graph.lights[i].exponent;

			this.lights[i].setSpotCutOff(n);

    	}
    	else
    	{
    		this.angle = (2*Math.PI)/360;
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

			// creates a variable in this (XMLscene) with [this.graph.lights[i].id] name
			// so you can access this.<light ID> = false
			// for example: this.omni1 = false
			this[this.graph.lights[i].id] = true;
		}

		else
		{
		
		this[this.graph.lights[i].id] = false;
		}
		
		// to have the number of lights in the scene
		this.numOfLights++;
	}

	console.log(this.graph.lights);

	this.application.interface.addLightsMenu(this.graph.lights, this.numOfLights);
	

}

XMLscene.prototype.updateLights = function(){

    for (var i=0; i<this.graph.lights.length; i++){
		if(this[this.graph.lights[i].id])
			this.lights[i].enable();
		else
			this.lights[i].disable();

		this.lights[i].update();
    }
};


XMLscene.prototype.changeCamera = function(i){

	var orderedLights = Object.keys(this.cameras);
	i = i % orderedLights.length;

	console.log(orderedLights);
	console.log(this.cameras);
	
	if (i >= orderedLights.length)
		return "i out of range";

	this.camera = new CGFcamera(this.cameras[orderedLights[i]].angle, this.cameras[orderedLights[i]].near, this.cameras[orderedLights[i]].far, this.cameras[orderedLights[i]].position, this.cameras[orderedLights[i]].target);
	
	this.application.interface.setActiveCamera(this.camera);
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
		this.updateLights();	
	}

	this.processGraph(this.graph.sceneRoot, null, null);

};

/**FROM HERE ON THE FUNCTIONS ARE OURS**/

XMLscene.prototype.processGraph = function(nodeName, material, texture)
{

	if (nodeName == null){
		return "Process Graph: null node name.";
	}

	var node = this.graph.nodes.get(nodeName);

	var matPosition = this.materialCounter % node.materials.length;

	var mat = node.materials[matPosition];
	var tex = node.texture;

	//if is primitive
	if (node.isPrimitive){
		node.primitive.display();
		return;
	}
	
	//if materials is empty
	if (mat == null){
		return "Process Graph: material needs to be declared.";
	}

	//if texture is null
	if (tex == null){
		return "Process Graph: texture needs to be declared.";
	}


	if (mat == "inherit"){
		//NADA
	}

	else{
		material = mat;		
	}
	
	if (tex == "none"){
		//texture = null;
		this.materials[material].setTexture(null);
	}
	else{
		

		if (tex == "inherit"){
			//texture não muda
		}

		else{
			texture = tex;		
		}
		this.materials[material].setTexture(this.textures[texture]);
	}
	
	
	
	this.materials[material].apply();

	this.multMatrix(node.mat);

		
	for(var i = 0; i < node.children.length; i++){
		this.pushMatrix();

			this.processGraph(node.children[i], material, texture);

		this.popMatrix();
	}

};
