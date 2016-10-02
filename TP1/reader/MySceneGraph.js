
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
}

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
	};

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
	}

	console.log(this.reader.getString(scene, 'root'));

};

/* VIEWS PARSER 
-Camera perspectives
*/

MySceneGraph.prototype.parseDSXViews = function (rootElement){

	var search = rootElement.getElementsByTagName('');

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

	//Get background color

	search = illumination.getElementsByTagName('background');

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

		if(this.getRGBAFromDSX(ambient) == null)
		{
			return this.onXMLError("bad RGBA on 'ambient' component of omnilight " + id);
		}

	}

};
	
/**********************
*	DSX Global Parser *
***********************/

MySceneGraph.prototype.parseDSXFile = function (rootElement) {

	this.parseDSXScene(rootElement);
	this.parseDSXIllumination(rootElement);
	this.parseDSXLights(rootElement);

};

/*
 * Callback to be executed on any read error
 */
 
MySceneGraph.prototype.onXMLError=function (message) {
	console.error("XML Loading Error: "+message);	
	this.loadedOk=false;
};

/************************
*   UTILITY FUNCTIONS   *
*************************/

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