
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
		return "scene element is missing.";
	}

	var root = this.reader.getString(scene, 'root');
	var axis_length = this.reader.getString(scene, 'axis_length');

};

/* VIEWS PARSER 
-Camera perspectives
*/

MySceneGraph.prototype.parseDSXViews = function (rootElement){

	var search = rootElement.getElementsByTagName('views');
	
	//fazer ciclo for para várias vistas
	var views = search[0];
	
	if (views == null)
		return "views element is missing";
	
	
	search = views.getElementsByTagName('perspective');
	
	if (search.length == 0)
		return "perspective element is missing";
	
	for (var i=0; i< search.length; i++){
		
		var perspective = search[i];
		
		var id = this.reader.getString(perspective, 'id');	
		var near = this.reader.getFloat(perspective, 'near');
		var far = this.reader.getFloat(perspective, 'far');
		var angle = this.reader.getFloat(perspective, 'angle');
		
		//get from - x y z
		search = perspective.getElementsByTagName('from');
		
		var fromp = search[0];
		
		if (fromp == null)
			return "no perspective (from failed)";
		
		/*var coordf = [];
		coordf.push(this.reader.getFloat(fromp, 'x');
		coordf.push(this.reader.getFloat(fromp, 'y');
		coordf.push(this.reader.getFloat(fromp, 'z');
		
		
		//get to - x y z
		search = perspective.getElementsByTagName('to');
		
		var to = search[0];
		
		if (to == null)
			return "no perspective (to failed)";
		
		var coordt = [];
		coordt.push(this.reader.getFloat(fromp, 'x');
		coordt.push(this.reader.getFloat(fromp, 'y');
		coordt.push(this.reader.getFloat(fromp, 'z');*/
		
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
		return "illumination element is missing.";
	};

	//Get ambient illumination
	search = illumination.getElementsByTagName('ambient');

	var ambient = search[0];

	if (ambient == null)
	{
		return "ambient illumination is missing."	
	};

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
	
/**********************
*	DSX Global Parser *
***********************/

MySceneGraph.prototype.parseDSXFile = function (rootElement) {

	this.parseDSXScene(rootElement);
	this.parseDSXIllumination(rootElement);

};

/*
 * Callback to be executed on any read error
 */
 
MySceneGraph.prototype.onXMLError=function (message) {
	console.error("XML Loading Error: "+message);	
	this.loadedOk=false;
};


