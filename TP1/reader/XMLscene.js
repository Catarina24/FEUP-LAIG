
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



/** TESTES */
	this.quad = new MyQuad(this, -1.5,1.5, -1, 1);
	this.triangle = new MyTriangle(this, 0, 2, 0, 0, 0, 3, 0, 0, 0);

	this.cylinder = new MyCylinder(this, 40, 10, 2, 0.5, 0.5);

	this.torus = new MyTorus(this, 0.2, 0.5, 50, 40);

	this.sphere = new MySphere(this, 40, 10, 0.5);

	this.seaAppearance = new CGFappearance(this);
	this.seaAppearance.loadTexture("../reader/scenes/resources/sea.png");

	//this.seaAppearance.setTextureWrap('CLAMP_TO_EDGE', 'CLAMP_TO_EDGE');
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
	this.gl.clearColor(this.graph.background[0],this.graph.background[1],this.graph.background[2],this.graph.background[3]);
	this.lights[0].setVisible(true);
    this.lights[0].enable();

	this.init_variables();
	this.changeCamera(0);

	
};

XMLscene.prototype.init_variables = function(){
	this.cameras = this.graph.cameras;
	this.textures = this.graph.textures;
	this.materials = this.graph.materials;
	this.primitives = this.graph.primitives;

	
}


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
	};	


	/**					TESTES!!!!!! 				 */

	//this.sphere.display();



	//left wall - mirror
	this.pushMatrix();
		this.translate(0, 0, 6);
		this.rotate(Math.PI/2, 0, 1, 0);
		this.translate(3, 2, 0);
		this.scale(2, 2, 0);


		//this.setDiffuse(0.2, 0.5, 0.1, 1.0);
		//this.setSpecular(1, 1, 1, 1);
		this.setAmbient(1, 1, 1, 1);
		this.quad.display();

	this.popMatrix();

	//right wall
	this.pushMatrix();
		this.translate(3, 2, 0);
		this.scale(2, 2, 0);
		this.quad.display();

	this.popMatrix();

	//floor
	this.pushMatrix();
		this.translate(0, 0, 6);
		this.rotate(3*Math.PI/2, 1, 0, 0);
		this.translate(3, 3, 0);
		this.scale(2, 3, 0);
		//this.seaAppearance.apply();
		this.quad.display();

	this.popMatrix();

	/*this.pushMatrix();
		this.triangle.display();
	this.popMatrix();*/

	/*this.pushMatrix();
		this.translate(0, 2, 0);
		this.rotate(Math.PI/2, 1, 0, 0);
		this.cylinder.display();
	this.popMatrix();*/


	/*this.torus.display();*/
};

/**FROM HERE ON THE FUNCTIONS ARE OURS**/


