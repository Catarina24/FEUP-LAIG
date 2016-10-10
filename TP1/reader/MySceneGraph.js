
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
	this.scene = null;
	this.axis_length = 10; 
	
	//Cameras
	this.cameras = [];

	//Illumination
	this.ambient = null;
	this.background = null;

	//Lights
	this.lights =[];

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
 * Example of method that parses elements of one block and stores information in a specific data structure
 */
MySceneGraph.prototype.parseGlobalsExample= function(rootElement) {

	var elems =  rootElement.getElementsByTagName('globals');
	if (elems == null) {
		return "globals element is missing.";
	}

	if (elems.length != 1) {
		return "either zero or more than one 'globals' element found.";
	}

	// various examples of different types of access
	var globals = elems[0];
	this.background = this.reader.getRGBA(globals, 'background');
	this.drawmode = this.reader.getItem(globals, 'drawmode', ["fill","line","point"]);
	this.cullface = this.reader.getItem(globals, 'cullface', ["back","front","none", "frontandback"]);
	this.cullorder = this.reader.getItem(globals, 'cullorder', ["ccw","cw"]);

	console.log("Globals read from file: {background=" + this.background + ", drawmode=" + this.drawmode + ", cullface=" + this.cullface + ", cullorder=" + this.cullorder + "}");

	var tempList=rootElement.getElementsByTagName('list');

	if (tempList == null  || tempList.length==0) {
		return "list element is missing.";
	}

	this.list=[];
	// iterate over every element
	var nnodes=tempList[0].children.length;
	for (var i=0; i< nnodes; i++)
	{
		var e=tempList[0].children[i];

		// process each element and store its information
		this.list[e.id]=e.attributes.getNamedItem("coords").value;
		console.log("Read list item id "+ e.id+" with value "+this.list[e.id]);
	}

};



/* SCENE PARSER
-Name of root node
-Size of axis
*/

MySceneGraph.prototype.parseDSXScene = function (rootElement){

	var search = rootElement.getElementsByTagName('scene');  

	// getElementsByTagName(<tag>) returns a NodeList with all the elements named
	// with the argument tag

	var scene = search[0];

	if (scene == null) {
		return this.onXMLError("scene element is missing.");

	var root = this.reader.getString(scene, 'root');
	var axis_length = this.reader.getString(scene, 'axis_length');

	}
};

/* VIEWS PARSER 
-Camera perspectives
*/

MySceneGraph.prototype.parseDSXViews = function (rootElement){

	var search_views = rootElement.getElementsByTagName('views');

	if (search_views.length == 0)
		return this.onXMLError("views element is missing");
	
	//se várias vistas declaradas, o default é a primeira
	//var default_view = search_views[0];
	
	//cada vez que v/V é carregado, vista muda para a próxima da lista

	for (var j=0;j<search_views.length; j++){

		//fazer ciclo for para várias vistas
		var views = search_views[j];
		
		//var vdefault = this.reader.getString(views, 'default');
		//console.log("view: " + vdefault);

		var perspectives = views.getElementsByTagName('perspective');

		if (perspectives.length == 0)
			return this.onXMLError("perspective element is missing");
		
		for (var i=0; i< perspectives.length; i++){

			var perspective = perspectives[i];

			var id = this.reader.getString(perspective, 'id');
			var near = this.reader.getFloat(perspective, 'near');
			var far = this.reader.getFloat(perspective, 'far');
			var angle = this.reader.getFloat(perspective, 'angle');

			//get from - x y z
			var search = perspective.getElementsByTagName('from');

			var from = search[0];

			if (from == null)
				return "no perspective (from failed)";

			
			var coordf = this.getCoordFromDSX(fromp);

			console.log("from:" + coordf);

			//get to - x y z
			search = perspective.getElementsByTagName('to');

			var to = search[0];

			if (to == null)
				return "no perspective (to failed)";

			var coordt = this.getCoordFromDSX(to);

			console.log("to:" + coordt);

		}
	}

};

/* ILLUMINATION PARSER 
-Global illumination 
-Background
*/

MySceneGraph.prototype.parseDSXIllumination = function (rootElement){

	var search = rootElement.getElementsByTagName('illumination');

	var illumination = search[0];

	if (illumination == null)
	{
		return this.onXMLError("illumination element is missing.");
	};

	//Get ambient illumination
	search = illumination.getElementsByTagName('ambient');

	var ambient = search[0];

	if (ambient == null)
	{
		return this.onXMLError("ambient illumination is missing.");	
	};

	var ambientRGBA = [];

	ambientRGBA.push(this.reader.getFloat(ambient, 'r'));
	ambientRGBA.push(this.reader.getFloat(ambient, 'g'));
	ambientRGBA.push(this.reader.getFloat(ambient, 'b'));
	ambientRGBA.push(this.reader.getFloat(ambient, 'a'));

	this.ambient = ambientRGBA;


	//Get background color

	search = illumination.getElementsByTagName('background');

	if (search == null)
		return "background does not exist"

	if (search.length != 1)
		return "more than one background"

	var background = search[0];

	var bgRGBA = [];

	bgRGBA.push(this.reader.getFloat(background, 'r'));
	bgRGBA.push(this.reader.getFloat(background, 'g'));
	bgRGBA.push(this.reader.getFloat(background, 'b'));
	bgRGBA.push(this.reader.getFloat(background, 'a'));

	this.background = bgRGBA;

	console.log(bgRGBA);

};

/* LIGHTS PARSER
-Gives location and color of omnilights
-Gives location, target and color of omnilights
*/

MySceneGraph.prototype.parseDSXLights = function (rootElement){

	var search = rootElement.getElementsByTagName('lights');

	var lights = search[0];

	if (lights == null)
	{
		return this.onXMLError("lights element is missing.");
	};

	// Searches both kind of lights: omni and spot
	var searchOmni = lights.getElementsByTagName('omni');
	var searchSpot = lights.getElementsByTagName('spot');

	if (searchOmni.length == 0 && searchSpot == 0)
	{
		return this.onXMLError("no lights are defined. Please defined either an omnilight or a spotlight.");
	}

	// Extrapolate omni lights
	for (var i = 0; i < searchOmni.length; i++)
	{
		var omni = searchOmni[i];
		var id = this.reader.getString(omni, 'id');
		var enabled = this.reader.getBoolean(omni, 'enabled');


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
			return this.onXMLError("there's a component missing in " + id + " light.")
		}

		// Light ambient

		var searchAmbient = omni.getElementsByTagName('ambient');
		var ambient = searchAmbient[0];
		var ambientRGBA = this.getRGBAFromDSX(ambient);

		if(ambientRGBA == null)
		{
			return this.onXMLError("bad RGBA on 'ambient' component of omnilight " + id);
		}

		// Light diffuse

		var searchDiffuse = omni.getElementsByTagName('diffuse');
		var diffuse = searchAmbient[0];
		var diffuseRGBA = this.getRGBAFromDSX(diffuse);

		if(diffuseRGBA == null)
		{
			return this.onXMLError("bad RGBA on 'diffuse' component of omnilight " + id);
		}

		// Light specular

		var searchSpecular = omni.getElementsByTagName('specular');
		var specular = searchSpecular[0];
		var specularRGBA = this.getRGBAFromDSX(specular);

		if(specularRGBA == null)
		{
			return this.onXMLError("bad RGBA on 'specular' component of omnilight " + id);
		}

	}

};


/* TEXTURES PARSER 
*
*/

MySceneGraph.prototype.parseDSXTextures = function (rootElement){
	
	var search = rootElement.getElementsByTagName('textures');
	
	var textures = search[0];
	
	//se "textures" não está no documento dsx
	if (textures==null)
		return this.onXMLError("Textures element is missing");
	
	
	var texture = textures.getElementsByTagName('texture');
	
	//se "textures" não tem filhos
	if (texture.length == 0)
		return this.onXMLError("Texture element is missing");
	
	for (var i=0; i<texture.length; i++){
		
		search = texture[i];
		
		var id = this.reader.getString(search, 'id');
		var file = this.reader.getString(search, 'file');
		var length_s = this.reader.getFloat(search, 'length_s');
		var length_t = this.reader.getFloat(search, 'length_t');
		
	}
};

/* MATERIALS PARSER 
 *
 */
MySceneGraph.prototype.parseDSXMaterials = function (rootElement){
	
	var search = rootElement.getElementsByTagName('materials');
	
	var materials = search[0];
	
	//se "materials" não está no documento dsx
	if (materials==null)
		return this.onXMLError("Materials element is missing");
	
	
	var material = materials.getElementsByTagName('material');
	
	//se "materials" não tem filhos
	if (material.length == 0)
		return this.onXMLError("Material element is missing");
	
	for (var i=0; i<material.length; i++){
		
		search = material[i];
		
		var emission = search.getElementsByTagName('emission');
		var ergb = this.getRGBAFromDSX(emission[0]);
		console.log(ergb);
		
		var ambient = search.getElementsByTagName('ambient');
		var argb = this.getRGBAFromDSX(ambient[0]);
		console.log(argb);
		
		var diffuse = search.getElementsByTagName('diffuse');
		var drgb = this.getRGBAFromDSX(diffuse[0]);
		console.log(drgb);
		
		var specular = search.getElementsByTagName('specular');
		var srgb = this.getRGBAFromDSX(specular[0]);
		console.log(srgb);
		
		var shininess = search.getElementsByTagName('shininess');
		
			
	}
};


/* TRANSFORMATIONS PARSER 
 *
 */
MySceneGraph.prototype.parseDSXTransformations = function (rootElement){
	
	var search = rootElement.getElementsByTagName('transformations');
	
	var transformations = search[0];
	
	//se "transformations" não está no documento dsx
	if (transformations==null)
		return this.onXMLError("Transformations element is missing");
	
	
	var transformation = transformations.getElementsByTagName('transformation');
	
	//se "transformations" não tem filhos
	if (transformation.length == 0)
		return this.onXMLError("Transformation element is missing");
	
	for (var i=0; i<transformation.length; i++){
		
		search = transformation[i];
		
		var id = this.reader.getString(search, 'id');
		

		var list = search.children;
		
		//if no transformations are found
		if (list.length == 0)
			return this.onXMLError("no transformations can be read");
				
		for (var j=0; j<list.length; j++){
			if (list[i].nodeName == 'translate')
				console.log("sim");
		}
		
		console.log(list);
			
	}
};

/*
* PRIMITVES PARSER ** UNFINISHED
-Available primitives for scene drawing
*/

MySceneGraph.prototype.parseDSXPrimitives = function (rootElement){

	var searchPrimitives = rootElement.getElementsByTagName('primitives');
	
	var primitives = searchPrimitives[0];

	if (primitives==null)
		return this.onXMLError("Primitives element is missing");

	var primitive = primitives.getElementsByTagName('primitive');

	if(primitive.length == 0)
		return this.onXMLError('There are no primitives defined inside the primitives block.');
	
	for (var i = 0; i < primitive.length; i++)
	{
		var id = this.reader.getString(primitive[i], 'id');

		console.log(primitive[i]);

		var primitiveShapesList = primitive[i].children;

		console.log(primitive[i].children);

		this.parseRectangles(primitive[i].children[0]);
	}
};

/** Parses rectangles information **/

MySceneGraph.prototype.parseRectangles = function (rectangleElement){

	var x1 = this.reader.getFloat(rectangleElement, 'x1');
	var x2 = this.reader.getFloat(rectangleElement, 'x2');
	var y1 = this.reader.getFloat(rectangleElement, 'y1');
	var y2 = this.reader.getFloat(rectangleElement, 'y2');

	console.log(x1,x2,y1,y2);

};


/** COMPONENTS PARSER
* - build the scene graph, transforming each component into a node
*/

MySceneGraph.prototype.parseDSXComponents = function (rootElement){

	// Empty list that will store the component nodes
	

	var searchComponents = rootElement.getElementsByTagName('components');
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

	}

}

/**********************
*	DSX Global Parser *
***********************/

MySceneGraph.prototype.parseDSXFile = function (rootElement) {

	this.parseDSXScene(rootElement);
	this.parseDSXIllumination(rootElement);
	this.parseDSXViews(rootElement);
	this.parseDSXTextures(rootElement);
	this.parseDSXMaterials(rootElement);
	this.parseDSXTransformations(rootElement);
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

	if(r == null)
	{
		return this.onXMLError("missing component 'r''");
	}

	if(g == null)
	{
		return this.onXMLError("missing component 'g'");
	}

	if(b == null)
	{
		return this.onXMLError("missing component 'b'");
	}

	if(a == null)
	{
		return this.onXMLError("missing component 'a'");
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
