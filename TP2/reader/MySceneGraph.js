
function MySceneGraph(filename, scene) {
	this.loadedOk = null;

	// Establish bidirectional references between scene and graph
	this.scene = scene;
	scene.graph=this;

	// File reading 
	this.reader = new CGFXMLreader();

	/*
	 * Read the contents of the xml file, and refer to this class for loading and error handlers.
	 * After the file is read, the reader calls onXMLReady on this object.
	 * If any error occurs, the reader calls onXMLError on this object, with an error message
	 */

	this.reader.open('scenes/'+filename, this);  

	/** Information from parsers (values by default) **/

	//Scene
	this.sceneRoot = null;
	this.axis_length = 10; 
	
	//Cameras
	this.default_view=null;
	this.cameras = [];

	//Illumination
	this.ambient = null;
	this.background = null;
	this.doublesidedIllumination = 0;
	this.local = 0;

	//Lights
	this.lights =[];
	
	//Textures
	this.textures = [];
	
	//Materials
	this.materials=[];
	
	//Transformations
	this.transformations=[];

	//animations
	this.animations=[];

	//Scene Nodes
	this.nodes = new Map();

	//Primitives
	this.primitives =[];

	this.local = null;


};

/*
 * Callback to be executed after successful reading
 */
MySceneGraph.prototype.onXMLReady=function() 
{
	console.log("XML Loading finished.");
	var rootElement = this.reader.xmlDoc.documentElement;

	// Here should go the calls for different functions to parse the various blocks
	var error = this.parseDSXFile(rootElement);

	if (error != null) {
		this.onXMLError(error);
		return;
	}	

	this.loadedOk=true;

	// As the graph loaded ok, signal the scene so that any additional initialization depending on the graph can take place
	this.scene.onGraphLoaded();
};


/*
 * Callback to be executed on any read error
 */
MySceneGraph.prototype.onXMLError=function (message) {
	console.error("XML Loading Error: "+message);	
	this.loadedOk=false;
};


/*
 *	Convert degrees to radians
 */
 
MySceneGraph.prototype.convertDegreesToRadians = function(angle){
	 
	 return angle*Math.PI/180;
	 
 };

/*
 *	Reads rotate axis and angle
 */
MySceneGraph.prototype.getRotateFromDSX = function (attributeName){
	var axis = this.reader.getString(attributeName, 'axis');
	var angle_degrees = this.reader.getString(attributeName, 'angle');
	
	var angle = this.convertDegreesToRadians(angle_degrees);
	
	var coord = [];
	
	if (axis == 'x')
		coord.push(1, 0, 0);
	else if (axis == 'y')
		coord.push(0, 1, 0);
	else if (axis == 'z')
		coord.push(0, 0, 1);
	else
		return this.onXMLError("getRotateFromDSX: Axis has to be x, y or z");
	
	coord.push(angle);
	
	return coord;
};

/*
 *	Verifies the order of the blocks
 */

 MySceneGraph.prototype.verifyOrder = function(rootElement){
	var search = rootElement.children;
	
	if (search.length < 10)
		return this.onXMLError("There's one or more elements missing");
	
	else if (search.length > 10)
		return this.onXMLError("There are too many <dsx> elements");
			
	else if (search[0].tagName != 'scene' ||
		search[1].tagName != 'views' ||
		search[2].tagName != 'illumination' ||
		search[3].tagName != 'lights' ||
		search[4].tagName != 'textures' ||
		search[5].tagName != 'materials' ||
		search[6].tagName != 'transformations' ||
		search[7].tagName != 'animations' ||
		search[8].tagName != 'primitives' ||
		search[9].tagName != 'components')
		console.warn("The blocks are not in the right order");
	
 }

/* SCENE PARSER
-Name of root node
-Size of axis
*/

MySceneGraph.prototype.parseDSXScene = function (rootElement){

	// getElementsByTagName(<tag>) returns a NodeList with all the elements named
	// with the argument tag
	var search = this.searchChildren(rootElement, 'scene');

	if(search.length != 1)
	{
		return this.onXMLError("There must be one and only one 'scene' element block.")
	}

	var scene = search[0];

	var root = this.reader.getString(scene, 'root');
	var axis_length = this.reader.getString(scene, 'axis_length');
	
	this.sceneRoot = root;
	this.axis_length = axis_length;

};

/* VIEWS PARSER 
-Camera perspectives
*/

MySceneGraph.prototype.parseDSXViews = function (rootElement){

	var search = this.searchChildren(rootElement, 'views');
	
	var views = search[0];
	
	//cada vez que v/V é carregado, vista muda para a próxima da lista	
	
	if(search.length != 1)
	{
		return this.onXMLError("There must be one and only one 'views' element block.")
	}
		
	var vdefault = this.reader.getString(views, 'default');
	//console.log("view: " + vdefault);

	var perspectives = views.getElementsByTagName('perspective');

	if (perspectives.length == 0)
		return this.onXMLError("Perspective element is missing");
	
		
	for (var i=0; i< perspectives.length; i++){
		
		//se várias vistas declaradas, o default é a primeira
		//var default_view = search[0];
		
		var perspective = perspectives[i];

		
		var id = this.reader.getString(perspective, 'id');
		
		if (this.cameras[id] == null){
			var view = new MyView(this.scene);
			
			view.near = this.reader.getFloat(perspective, 'near');
			view.far = this.reader.getFloat(perspective, 'far');
			var angle = this.reader.getFloat(perspective, 'angle');

			view.angle = this.convertDegreesToRadians(angle);

			//get from - x y z
			search = perspective.getElementsByTagName('from');
			
			var fromp = search[0];
			if (fromp == null)
				return "no perspective (from failed)";

				
			var pos = this.getCoordFromDSX(fromp);
			view.position = vec3.fromValues(pos[0], pos[1], pos[2]);

			//get to - x y z
			search = perspective.getElementsByTagName('to');

			var to = search[0];

			if (to == null)
				return "no perspective (to failed)";

			var targ = this.getCoordFromDSX(to);
			view.target = vec3.fromValues(targ[0], targ[1], targ[2]);
			
			this.cameras[id] = view;
			
			if(i==0)	// first camera default
			{
				this.default_view = i;
			}

			if(vdefault == id)	// specified camera default
			{
				this.default_view = i;
			}
		}
		else{
			return this.onXMLError("Perspectives: Repeated ids");
		}	
	}
};

/* ILLUMINATION PARSER 
-Global illumination 
-Background
*/

MySceneGraph.prototype.parseDSXIllumination = function (rootElement){

	var search = this.searchChildren(rootElement, 'illumination');

	var illumination = search[0];

	this.local = this.reader.getFloat(illumination, 'local');

	if(search.length != 1)
	{
		return this.onXMLError("There must be one and only one 'illumination' element block.")
	}

	//Get ambient illumination
	search = illumination.getElementsByTagName('ambient');

	var ambient = search[0];

	if (ambient == null)
		return this.onXMLError("ambient illumination is missing.");	

	var ambientRGBA = [];

	ambientRGBA.push(this.reader.getFloat(ambient, 'r'));
	ambientRGBA.push(this.reader.getFloat(ambient, 'g'));
	ambientRGBA.push(this.reader.getFloat(ambient, 'b'));
	ambientRGBA.push(this.reader.getFloat(ambient, 'a'));

	this.ambient = ambientRGBA;

	//Get background color

	search = illumination.getElementsByTagName('background');

	if (search == null)
		return this.onXMLError("background does not exist");

	if (search.length != 1)
		return this.onXMLError("more than one background");

	var background = search[0];

	var bgRGBA = [];

	bgRGBA.push(this.reader.getFloat(background, 'r'));
	bgRGBA.push(this.reader.getFloat(background, 'g'));
	bgRGBA.push(this.reader.getFloat(background, 'b'));
	bgRGBA.push(this.reader.getFloat(background, 'a'));

	this.background = bgRGBA;
	
};

/* LIGHTS PARSER
-Gives location and color of omnilights
-Gives location, target and color of omnilights
*/

MySceneGraph.prototype.parseDSXLights = function (rootElement){

	var search = this.searchChildren(rootElement, 'lights');

	var lights = search[0];

	if(search.length != 1)
	{
		return this.onXMLError("There must be one and only one 'lights' element block.")
	}

	// Searches both kind of lights: omni and spot
	var searchOmni = lights.getElementsByTagName('omni');
	var searchSpot = lights.getElementsByTagName('spot');

	if (searchOmni.length == 0 && searchSpot == 0)
	{
		return this.onXMLError("no lights are defined. Please defined either an omni light or a spotlight.");
	}

	if(this.lights.children > 8)
	{
		return this.onXMLError("There can not be more than 7 lights.");
	}

	// Extrapolate omni lights
	for (var i = 0; i < searchOmni.length; i++)
	{
		var light = new MyLight(this.scene);

		light.omni = true;

		var omni = searchOmni[i];

		light.id = this.reader.getString(omni, 'id');

		//Verify if ID is UNIQUE
		for(var j = 0; j < this.lights.length; j++)
		{
			if(this.lights[j].id == light.id)
				return this.onXMLError("light in position " + (i+1) + " has a duplicated id");
		}

		light.enabled = this.reader.getBoolean(omni, 'enabled');


		// Light location
		var searchLocation = omni.getElementsByTagName('location');
		var location = searchLocation[0];

		var locationX = this.reader.getFloat(location, 'x');
		var locationY = this.reader.getFloat(location, 'y');
		var locationZ = this.reader.getFloat(location, 'z');
		var locationW = this.reader.getFloat(location, 'w');

		if(locationX == null || locationY == null || 
		locationZ == null || locationW == null)
		{
			return this.onXMLError("there's a component missing in " + light.id + " light.")
		}

		light.location.push(locationX);
		light.location.push(locationY);
		light.location.push(locationZ);
		light.location.push(locationW);

		// Light ambient

		var searchAmbient = omni.getElementsByTagName('ambient');
		var ambient = searchAmbient[0];
		light.ambientRGBA = this.getRGBAFromDSX(ambient);

		if(light.ambientRGBA == null)
		{
			return this.onXMLError("bad RGBA on 'ambient' component of omnilight " + light.id);
		}

		// Light diffuse

		var searchDiffuse = omni.getElementsByTagName('diffuse');
		var diffuse = searchDiffuse[0];
		light.diffuseRGBA = this.getRGBAFromDSX(diffuse);

		if(light.diffuseRGBA == null)
		{
			return this.onXMLError("bad RGBA on 'diffuse' component of omnilight " + light.id);
		}

		// Light specular

		var searchSpecular = omni.getElementsByTagName('specular');
		var specular = searchSpecular[0];
		light.specularRGBA = this.getRGBAFromDSX(specular);

		if(light.specularRGBA == null)
		{
			return this.onXMLError("bad RGBA on 'specular' component of omnilight " + light.id);
		}

		this.lights.push(light);
	}

	// Extrapolate spot lights
	for (var i = 0; i < searchSpot.length; i++)
	{
		var light = new MyLight(this.scene);

		light.omni = false;

		var spot = searchSpot[i];

		light.id = this.reader.getString(spot, 'id');

		//Verify if ID is UNIQUE
		for(var j = 0; j < this.lights.length; j++)
		{
			if(this.lights[j].id == light.id)
				return this.onXMLError("light in position " + (i+1) + " has a duplicated id");
		}
	

		//VERIFICAÇOES DE ERROS - FAZER
		light.enabled = this.reader.getBoolean(spot, 'enabled');

		if (light.enabled != 0 && light.enabled != 1){
			return this.onXMLError("Light: values for enabled must be between 0 and 1");
		}

		var angle = this.reader.getFloat(spot, 'angle');
		light.angle = this.convertDegreesToRadians(angle);

		light.exponent = this.reader.getFloat(spot, 'exponent');

		if (light.exponent < 0 || light.exponent > 128){
			return this.onXMLError("Light: values for exponent must be between 0 and 128");
		}

		//Light Target
		var searchTarget = spot.getElementsByTagName('target');
		var target = searchTarget[0];

		var targetX = this.reader.getFloat(target, 'x');
		var targetY = this.reader.getFloat(target, 'y');
		var targetZ = this.reader.getFloat(target, 'z');

		if(targetX == null || targetY == null || targetZ == null){
			return this.onXMLError("there's a component missing in " + light.id + " light.")
		}

		light.target.push(targetX);
		light.target.push(targetY);
		light.target.push(targetZ);

		// Light location
		var searchLocation = spot.getElementsByTagName('location');
		var location = searchLocation[0];

		var locationX = this.reader.getFloat(location, 'x');
		var locationY = this.reader.getFloat(location, 'y');
		var locationZ = this.reader.getFloat(location, 'z');

		if(locationX == null || locationY == null || 
		locationZ == null)
		{
			return this.onXMLError("there's a component missing in " + light.id + " light.")
		}

		light.location.push(locationX);
		light.location.push(locationY);
		light.location.push(locationZ);

		// Light ambient

		var searchAmbient = spot.getElementsByTagName('ambient');
		var ambient = searchAmbient[0];
		light.ambientRGBA = this.getRGBAFromDSX(ambient);

		if(light.ambientRGBA == null)
		{
			return this.onXMLError("bad RGBA on 'ambient' component of omnilight " + light.id);
		}

		// Light diffuse

		var searchDiffuse = spot.getElementsByTagName('diffuse');
		var diffuse = searchDiffuse[0];
		light.diffuseRGBA = this.getRGBAFromDSX(diffuse);

		if(light.diffuseRGBA == null)
		{
			return this.onXMLError("bad RGBA on 'diffuse' component of omnilight " + light.id);
		}

		// Light specular

		var searchSpecular = spot.getElementsByTagName('specular');
		var specular = searchSpecular[0];
		light.specularRGBA = this.getRGBAFromDSX(specular);

		if(light.specularRGBA == null)
		{
			return this.onXMLError("bad RGBA on 'specular' component of omnilight " + light.id);
		}

		this.lights.push(light);
	}
};


/* TEXTURES PARSER 
*
*/

MySceneGraph.prototype.parseDSXTextures = function (rootElement){
	
	var search = this.searchChildren(rootElement, 'textures');
	
	if(search.length != 1)
	{
		return this.onXMLError("There must be one and only one 'textures' element block.")
	}

	var textures = search[0];
	
	var texture = textures.getElementsByTagName('texture');
	
	//se "textures" não tem filhos
	if (texture.length == 0)
		return this.onXMLError("Texture element is missing");
	
	var tex;
	var id;
	
	for (var i=0; i<texture.length; i++){
		
		search = texture[i];
		
		tex = new MyTexture(this.scene);
		tex.id = this.reader.getString(search, 'id');

		for (var j=0; j<this.textures.length; j++){
			if (id == this.textures[j].id)
				return this.onXMLError("Textures: there can only be one texture per id.");
		}
		
		tex.file = this.reader.getString(search, 'file');
		tex.length_s = this.reader.getFloat(search, 'length_s');
		tex.length_t = this.reader.getFloat(search, 'length_t');
		this.textures.push(tex);
	}
};

/* MATERIALS PARSER 
 *
 */
MySceneGraph.prototype.parseDSXMaterials = function (rootElement){
	
	var search = this.searchChildren(rootElement, 'materials');
	
	if(search.length != 1)
	{
		return this.onXMLError("There must be one and only one 'materials' element block.")
	}
	
	var material = search[0].getElementsByTagName('material');
	
	//se "materials" não tem filhos
	if (material.length == 0)
		return this.onXMLError("Material element is missing");
	
	var mat, id;
	
	for (var i=0; i<material.length; i++){
		
		search = material[i];
		
		id=this.reader.getString(search, 'id');

		for (var j=0; j<this.materials.length; j++){
			if (this.materials[j].id == id)
				return this.onXMLError("There can only be one material per id.");
		}
		
		mat = new MyMaterial(this.scene);

		
		mat.id=id;
			
		var emission = search.getElementsByTagName('emission');
		mat.emission = this.getRGBAFromDSX(emission[0]);
		
		var ambient = search.getElementsByTagName('ambient');
		mat.ambient = this.getRGBAFromDSX(ambient[0]);
			
		var diffuse = search.getElementsByTagName('diffuse');
		mat.diffuse = this.getRGBAFromDSX(diffuse[0]);
			
		var specular = search.getElementsByTagName('specular');
		mat.specular= this.getRGBAFromDSX(specular[0]);
			
		var shininess = search.getElementsByTagName('shininess');
		mat.shininess= this.reader.getFloat(shininess[0], 'value');
			
		this.materials.push(mat);
	
	}
};


/** 
 * TRANSFORMATIONS PARSER 
 * */ 

MySceneGraph.prototype.parseDSXTransformations = function (rootElement){
	
	var search = this.searchChildren(rootElement, 'transformations');

	if(search.length != 1)
	{
		return this.onXMLError("There must be one and only one 'transformations' element block.")
	}

	var transformations = search[0];

	var transformation = this.searchChildren(transformations, 'transformation');
	
	for (var i=0; i<transformation.length; i++){
		
		search = transformation[i];
		
		var id = this.reader.getString(search, 'id');

		if (this.transformations[id] ==null){

			var matrix = mat4.clone(this.calculateTransformMatrix(search));
			this.transformations[id]=matrix;
			//console.log(this.transformations);
		}
		else
		{
			return this.onXMLError("There are two or more transformations with the same id: " + id);
		}
	}
};

/**
 * ANIMATIONS PARSER 
 * */

MySceneGraph.prototype.parseDSXAnimation = function (rootElement){
	
	var search = this.searchChildren(rootElement, 'animations');

	if(search.length != 1)
	{
		return this.onXMLError("There must be one and only one 'animations' element block.")
	}

	var animations = search[0];
	var searchAnimation = this.searchChildren(animations, 'animation');
	
	for (var i=0; i<searchAnimation.length; i++){
		
		search = searchAnimation[i];
		
		var id = this.reader.getString(search, 'id');

		//Verifica se ja existe uma animação com id igual a variavel "id"
		if (this.animations[id] != null){
			return this.onXMLError("There are two or more transformations with the same id: " + id);
		}
		

		var span = this.reader.getFloat(search, 'span');
		var type = this.reader.getString(search, 'type');

		//caso a animacao seja linear
		if (type == 'linear'){

			var controlPoints = [];
			searchControlPoints = this.searchChildren(search, 'controlpoint');

			for (var j=0; j < searchControlPoints.length; j++){

				var controlP = searchControlPoints[j];

				controlPoints.push(this.getCoordFromDSX(controlP));

			}

			var animation = new MyLinearAnimation(this.scene, id, span, controlPoints);
			this.animations[id] = animation;
		}

		else if (type == 'circular'){

			var x = this.reader.getFloat(search, 'centerx');
			var y = this.reader.getFloat(search, 'centery');
			var z = this.reader.getFloat(search, 'centerz');

			var center = [x, y, z];

			var radius = this.reader.getFloat(search, 'radius');
			var startang = this.reader.getFloat(search, 'startang');
			var rotang = this.reader.getFloat(search, 'rotang');
			
			var animation = new MyCircularAnimation(this.scene, id, span, center, radius, startang, rotang);
			//this.animations.push(animation);
			this.animations[id] = animation;
		}

		else return this.onXMLError("Animation type must be linear or circular");

		
	}
	
};

/*
* PRIMITVES PARSER
-Available primitives for scene drawing
*/

MySceneGraph.prototype.parseDSXPrimitives = function (rootElement){

	var searchPrimitives = this.searchChildren(rootElement, 'primitives');
	
	var primitives = searchPrimitives[0];

	if (primitives==null)
		return this.onXMLError("Primitives element is missing");

	var primitive = primitives.getElementsByTagName('primitive');

	if(primitive.length == 0)
		return this.onXMLError('There are no primitives defined inside the primitives block.');
	
		for (var i = 0; i < primitive.length; i++){

			var id = this.reader.getString(primitive[i], 'id');

			var primitiveShapesList = primitive[i].children;

			if (primitiveShapesList.length > 1)
				return this.onXMLError("There can only be one primitive.");


			if(this.primitives[id] == null){
				/** 
				 * Rectangles
				 */
				if (primitiveShapesList[0].tagName == "rectangle"){
						var rectangle = this.parseRectangles(primitiveShapesList[0]);
						rectangle.id = id;

						var node = new MyNode();

						node.id = id;
						node.isPrimitive = true;
						node.primitive = rectangle;

						this.nodes.set("#"+node.id, node);

						this.primitives["#"+id] = rectangle;
				}

				/** 
				 * Triangles
				 */
				if (primitiveShapesList[0].tagName == "triangle"){

						var triangle = this.parseTriangles(primitiveShapesList[0]);
						triangle.id = id;

						var node = new MyNode();

						node.id = id;
						node.isPrimitive = true;
						node.primitive = triangle;

						this.nodes.set("#"+node.id, node);

						this.primitives["#"+id] = triangle;
				}

				/** 
				 * Sphere
				 */
				if (primitiveShapesList[0].tagName == "sphere"){

						var sphere = this.parseSpheres(primitiveShapesList[0]);
						sphere.id = id;

						var node = new MyNode();

						node.id = id;
						node.isPrimitive = true;
						node.primitive = sphere;

						this.nodes.set("#"+node.id, node);

						this.primitives["#"+id] = sphere;
				}


				/** 
				 * Cylinder
				 */
				if (primitiveShapesList[0].tagName == "cylinder"){

						var cylinder = this.parseCylinders(primitiveShapesList[0]);
						cylinder.id = id;

						var node = new MyNode();

						node.id = id;
						node.isPrimitive = true;
						node.primitive = cylinder;

						this.nodes.set("#"+node.id, node);

						this.primitives["#"+id] = cylinder;
				}

				/** 
				 * Torus
				 */
				if (primitiveShapesList[0].tagName == "torus"){
					
					var torus = this.parseTorus(primitiveShapesList[0]);
					torus.id = id;

					var node = new MyNode();

					node.id = id;
					node.isPrimitive = true;
					node.primitive = torus;

					this.nodes.set("#"+node.id, node);
					
					this.primitives["#"+id] = torus;
				}

				/**
				 *  Plane
				 */

				if (primitiveShapesList[0].tagName == "plane"){
					
					var plane = this.parsePlane(primitiveShapesList[0]);
					plane.id = id;

					var node = new MyNode();

					node.id = id;
					node.isPrimitive = true;
					node.primitive = plane;

					this.nodes.set("#"+node.id, node);
					
					this.primitives["#"+id] = plane;
				}

				/**
				 *  Patch
				 */

				if (primitiveShapesList[0].tagName == "patch"){
					
					var patch = this.parsePatch(primitiveShapesList[0]);
					patch.id = id;

					var node = new MyNode();

					node.id = id;
					node.isPrimitive = true;
					node.primitive = patch;

					this.nodes.set("#"+node.id, node);
					
					this.primitives["#"+id] = patch;
				}

				 /**
				 *  Vehicle
				 */

				if (primitiveShapesList[0].tagName == "vehicle"){
					
					var vehicle = this.parseVehicle(primitiveShapesList[0]);
					vehicle.id = id;

					var node = new MyNode();

					node.id = id;
					node.isPrimitive = true;
					node.primitive = vehicle;

					this.nodes.set("#"+node.id, node);
					
					this.primitives["#"+id] = vehicle;
				}
		}
	}
};

/** Parses rectangles information **/

MySceneGraph.prototype.parseRectangles = function (rectangleElement){

	var x1 = this.reader.getFloat(rectangleElement, 'x1');
	var x2 = this.reader.getFloat(rectangleElement, 'x2');
	var y1 = this.reader.getFloat(rectangleElement, 'y1');
	var y2 = this.reader.getFloat(rectangleElement, 'y2');

	var rectangle = new MyQuad(this.scene, x1, x2, y1, y2);

	return rectangle;
};

/** Parses Triangles information **/

MySceneGraph.prototype.parseTriangles = function (triangleElement){

	var x1 = this.reader.getFloat(triangleElement, 'x1');
	var x2 = this.reader.getFloat(triangleElement, 'x2');
	var x3 = this.reader.getFloat(triangleElement, 'x3');
	var y1 = this.reader.getFloat(triangleElement, 'y1');
	var y2 = this.reader.getFloat(triangleElement, 'y2');
	var y3 = this.reader.getFloat(triangleElement, 'y3');
	var z1 = this.reader.getFloat(triangleElement, 'z1');
	var z2 = this.reader.getFloat(triangleElement, 'z2');
	var z3 = this.reader.getFloat(triangleElement, 'z3');

	var triangle = new MyTriangle(this.scene, x1, x2, x3, y1, y2, y3, z1, z2, z3);

	return triangle;
};



MySceneGraph.prototype.parseSpheres = function (sphereElement){

	var radius = this.reader.getFloat(sphereElement, 'radius');
	var slices = this.reader.getFloat(sphereElement, 'slices');
	var stacks = this.reader.getFloat(sphereElement, 'stacks');

	var sphere = new MySphere(this.scene, slices, stacks, radius);

	return sphere;
};

MySceneGraph.prototype.parseCylinders = function (cylinderElement){

	var base = this.reader.getFloat(cylinderElement, 'base');
	var top = this.reader.getFloat(cylinderElement, 'top');
	var height = this.reader.getFloat(cylinderElement, 'height');
	var slices = this.reader.getFloat(cylinderElement, 'slices');
	var stacks = this.reader.getFloat(cylinderElement, 'stacks');

	var cylinder = new MyCylinder(this.scene, slices, stacks, height, base, top);

	return cylinder;
};

MySceneGraph.prototype.parseTorus = function (torusElement){

	var inner = this.reader.getFloat(torusElement, 'inner');
	var outer = this.reader.getFloat(torusElement, 'outer');
	var slices = this.reader.getFloat(torusElement, 'slices');
	var loops = this.reader.getFloat(torusElement, 'loops');

	var torus = new MyTorus(this.scene, inner, outer, slices, loops);

	return torus;
};

MySceneGraph.prototype.parsePlane = function (planeElement){

	var dimX = this.reader.getFloat(planeElement, 'dimX');
	var dimY = this.reader.getFloat(planeElement, 'dimY');
	var partsX = this.reader.getFloat(planeElement, 'partsX');
	var partsY = this.reader.getFloat(planeElement, 'partsY');

	var plane = new MyPlane(this.scene, dimX, dimY, partsX, partsY);

	return plane;
};

MySceneGraph.prototype.parsePatch = function (patchElement){

	var orderU = this.reader.getFloat(patchElement, 'orderU');
	var orderV = this.reader.getFloat(patchElement, 'orderV');
	var partsU = this.reader.getFloat(patchElement, 'partsU');
	var partsV = this.reader.getFloat(patchElement, 'partsV');

	var controlpoints = new Array();

	var numControlpoints = 0;
	var x, y, z;

	var controlpointsSearch = this.searchChildren(patchElement, 'controlpoint');

	for (var i=0; i<=orderU; i++){

		var controlpointsU = new Array();

		for (var j=0; j<=orderV; j++){

			x = this.reader.getFloat(controlpointsSearch[numControlpoints], 'x');
			y = this.reader.getFloat(controlpointsSearch[numControlpoints], 'y');
			z = this.reader.getFloat(controlpointsSearch[numControlpoints], 'z');

			var controlpointsV = new Array(x, y, z, 1);
			controlpointsU.push(controlpointsV);

			numControlpoints++;
		}

		controlpoints.push(controlpointsU);

	}

	var patch = new MyPatch(this.scene, orderU, orderV, partsU, partsV, controlpoints);

	return patch;
};


/** Parses Vehicle information */
MySceneGraph.prototype.parseVehicle = function(vehicleElement){
	var dimension = this.reader.getFloat(vehicleElement, 'dimension');

	var vehicle = new MyVehicle(this.scene, dimension);

	return vehicle;
}




/** COMPONENTS PARSER
* - build the scene graph, transforming each component into a node
*/

MySceneGraph.prototype.parseDSXComponents = function (rootElement){

	// Empty list that will store the component nodes
	

	var searchComponents = this.searchChildren(rootElement, 'components');

	var components = searchComponents[0];

	if(components == null)
	{
		return this.onXMLError("Components element is missing");
	}

	var component = components.getElementsByTagName('component');

	if(component.length == 0)
		return this.onXMLError('There are no components defined inside the components block.');
	

	for (var i = 0; i < component.length; i++)
	{
		var node = new MyNode();

		node.id = this.reader.getString(component[i], 'id');

		var children = node.childNodes;

		// TRANSFORMATIONS

		var transformations = this.searchChildren(component[i], 'transformation');

		if(transformations.length != 1)
		{
			return this.onXMLError("There can't be more than one transformation block for each component.")
		}

	
		//If the block is empty, matrix is identity; it will then be multiplied by its parent
		if (transformations[0].length == 0){
				node.mat = mat4.create();
		}

		//Checks if there is any reference to a transformation previously defined
		var transformationRef = this.searchChildren(transformations[0], 'transformationref');

		if (transformationRef.length > 1)
			return this.onXMLError("There needs to be one and only one transformationref block for each component.")
		
		if(transformationRef.length == 1)
		{
			var matrix = this.transformations[transformationRef[0].id];
			node.mat = mat4.clone(matrix);
		}
		else
		{
			node.mat = this.calculateTransformMatrix(transformations[0]);
		}

		//ANIMATIONS
		var searchAnimations = this.searchChildren(component[i], 'animation');
		
		// animation block can be empty
		if (searchAnimations.length != 0){
			var animations = searchAnimations[0].children;

			if(animations.length == 0){
				return this.onXMLError("At least one animation id should be defined for a component.");
			}

			for (var j=0; j<animations.length; j++){
				var animationref = animations[j];

				if (animationref.tagName != 'animationref')
					return this.onXMLError("Bad tag name inside animations block");

				var animationId = this.reader.getString(animationref, 'id');

				node.animations.push(animationId);
			}

		}

		// MATERIALS
		var searchMaterials = this.searchChildren(component[i],'materials');
		
		if(searchMaterials.length == 0 || searchMaterials.length > 1)
		{
			return this.onXMLError("There needs to be one and only one materials block for each component.")
		}
		
		// materials[0] is the first BLOCK
		var materials = searchMaterials[0].children;
	
		if(materials.length == 0)
		{
			return this.onXMLError("At least one material id should be defined for a component.")
		}

		
		for(var j = 0; j < materials.length; j++)
		{
			var material = materials[j];

			if(material.tagName != 'material')
			{
				return this.onXMLError("Bad tag name inside materials block.");
			}

			var materialId = this.reader.getString(material, 'id');

			node.materials.push(materialId);
		}
		
		// TEXTURE
		var texture = component[i].getElementsByTagName('texture');

		if(texture.length == 0 || texture.length > 1)
		{
			return this.onXMLError("There can only be one defined texture for a component.")
		}
		
		node.texture = this.reader.getString(texture[0],'id');

		// CHILDREN
		var children = component[i].getElementsByTagName('children');

		if(children.length == 0 || children.length > 1)
		{
			return this.onXMLError("There needs to be one and only one children block for each component.")
		}
		
		if(children[0].children.length == 0)
		{
			return this.onXMLError("At least one children id should be defined for a component.")
		}

		for(var j = 0; j < children [0].children.length; j++)
		{
			var child = children[0].children[j];

			var childID = this.reader.getString(child, 'id');

			if(child.nodeName == 'componentref')
			{
				node.children.push(childID);
			}
			else if(child.nodeName == 'primitiveref')
			{
				if(this.primitives["#" + childID] == null)
				{
					this.onXMLError("No primitive with name " + childID + " in component " + component[i].id);
					continue;
				}
				node.children.push("#" + childID);
			}
			else
			{
				return this.onXMLError('Invalid child at ' + i + ' component.');
			}
		}


		/*
			Adicionar informação a cada node.
			Adicionar node a this.nodes com [id (key), node(value)].

			Depois de adicionar os componentes e as primitivas, ver componentrefs,
			que determinam os filhos de cada nó e depois implementar DFS ao grafo.
		*/

		// Add node to scene graph
		this.nodes.set(node.id, node);
	}

	//console.log(this.nodes);
	
	//this.searchAllNodes();
};

/**********************
*	DSX Global Parser *
***********************/

MySceneGraph.prototype.parseDSXFile = function (rootElement) {

	this.verifyOrder(rootElement);
	
	this.parseDSXScene(rootElement);
	this.parseDSXIllumination(rootElement);
	this.parseDSXLights(rootElement);
	this.parseDSXViews(rootElement);
	this.parseDSXTextures(rootElement);
	this.parseDSXMaterials(rootElement);
	this.parseDSXTransformations(rootElement);
	this.parseDSXAnimation(rootElement);
	this.parseDSXPrimitives(rootElement);
	this.parseDSXComponents(rootElement);


};


/************************
*   UTILITY FUNCTIONS   *
*************************/

/*This function returns an array with the [R, G, B, A] components of an attribute.
If there's missing component, it returns an error.*/
MySceneGraph.prototype.getRGBAFromDSX = function(attributeName)
{
	var rgba = [];

	var r = this.reader.getFloat(attributeName, 'r');
	var g = this.reader.getFloat(attributeName, 'g');
	var b = this.reader.getFloat(attributeName, 'b');
	var a = this.reader.getFloat(attributeName, 'a');

	if(r == null){
		return this.onXMLError("missing component 'r'");
	}

	if(g == null){
		return this.onXMLError("missing component 'g'");
	}

	if(b == null){
		return this.onXMLError("missing component 'b'");
	}

	if(a == null){
		return this.onXMLError("missing component 'a'");
	}

	if(r < 0 || r > 1){
		return this.onXMLError("component 'r' does not have normalized values (between 0 and 1)");
	}

	if(g < 0 || g > 1){
		return this.onXMLError("component 'g' does not have normalized values (between 0 and 1)");
	}

	if(b < 0 || b > 1){
		return this.onXMLError("component 'b' does not have normalized values (between 0 and 1)");
	}

	if(a < 0 || a > 1){
		return this.onXMLError("component 'a' does not have normalized values (between 0 and 1)");
	}

	rgba.push(r, g, b, a);

	return rgba;
};

/*
 *	Reads 3D coordinates and returns a vector
 */
MySceneGraph.prototype.getCoordFromDSX = function (attributeName){
	var x = this.reader.getFloat(attributeName, 'x');
	var y = this.reader.getFloat(attributeName, 'y');
	var z = this.reader.getFloat(attributeName, 'z');
	
	if (x == null)
		return this.onXMLError("x coordinate is missing");
	if (y == null)
		return this.onXMLError("y coordinate is missing");
	if (z == null)
		return this.onXMLError("z coordinate is missing");
	
	var coord = [];
	coord.push(x, y, z);
	
	return coord;
};

/*
* 	Receives a transformation element and returns a single mat4 representing it
*/
MySceneGraph.prototype.calculateTransformMatrix = function (transformElement)
{
	var matrix, translate, scale, aux;

	var list = transformElement.children;
	
	//cria matriz identidade para as transformações
	matrix = mat4.create();

	if (list.length != 0)
	{		
		//for (var j=list.length-1; j>=0; j--){
		for (var j=0; j<list.length; j++){
			if (list[j].nodeName == 'translate'){
					translate = this.getCoordFromDSX(list[j]);
					mat4.translate(matrix, matrix, translate);
			}

			else if(list[j].nodeName == 'rotate'){
				aux = this.getRotateFromDSX(list[j]);
				var rotate = [];
				rotate.push(aux[0], aux[1], aux[2]);
				mat4.rotate(matrix, matrix, aux[3],rotate);
			}

			else if (list[j].nodeName == 'scale'){
				scale = this.getCoordFromDSX(list[j]);
				mat4.scale(matrix, matrix, scale);
			}
			else return this.onXMLError("There can only be translate, rotate or scale transformations");
		}
	}

	return matrix;		
};

/**
*	Return ONLY children elements with a certain tag name 
(does NOT return children of children)
*/

MySceneGraph.prototype.searchChildren = function (parentElement, childrenTag)
{
	var children = [];

	for (var i = 0; i < parentElement.children.length; i++)
	{
		if(parentElement.children[i].tagName == childrenTag)
		{
			children.push(parentElement.children[i]);
		}
	}

	return children;
}

/* DFS Graph Search*/

MySceneGraph.prototype.searchAllNodes = function(){

	console.log(this.nodes.size);
	
	// Iterates for component nodes
	for(var key of this.nodes.keys())
	{
		console.log(this.nodes.get(key));

		for(var j = 0; j < this.nodes.get(key).children.length; j++)
		{
			console.log(this.nodes.children);
		}
	}
};