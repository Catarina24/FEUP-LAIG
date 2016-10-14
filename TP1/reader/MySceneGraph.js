
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

	//Lights
	this.lights =[];
	
	//Textures
	this.textures = [];
	
	//Materials
	this.materials=[];
	
	//Transformations
	this.transformations=[];

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

/*
 *	Verifies the order of the blocks
 */

 MySceneGraph.prototype.verifyOrder = function(rootElement){
	var search = rootElement.children;
	
	if (search.length != 9)
		return this.onXMLError("There's one or more elements missing");
	
	else if (search[0].tagName != 'scene' ||
		search[1].tagName != 'views' ||
		search[2].tagName != 'illumination' ||
		search[3].tagName != 'lights' ||
		search[4].tagName != 'textures' ||
		search[5].tagName != 'materials' ||
		search[6].tagName != 'transformations' ||
		search[7].tagName != 'primitives' ||
		search[8].tagName != 'components')
		return this.onXMLError("The blocks are not in the right order");
	
 }

/* SCENE PARSER
-Name of root node
-Size of axis
*/

MySceneGraph.prototype.parseDSXScene = function (rootElement){

	// getElementsByTagName(<tag>) returns a NodeList with all the elements named
	// with the argument tag
	var search = rootElement.getElementsByTagName('scene');

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

	var search = rootElement.getElementsByTagName('views');
	
	var views = search[0];
	
	//cada vez que v/V é carregado, vista muda para a próxima da lista	
	
		
	//var vdefault = this.reader.getString(views, 'default');
	//console.log("view: " + vdefault);

	var perspectives = views.getElementsByTagName('perspective');

	if (perspectives.length == 0)
		return this.onXMLError("perspective element is missing");
	
	var exists;
		
	for (var i=0; i< perspectives.length; i++){
		
		//se várias vistas declaradas, o default é a primeira
		//var default_view = search[0];
		
		var perspective = perspectives[i];
		
		//verifies if the id already exists
		exists = false;
		
		var id = this.reader.getString(perspective, 'id');
		
		for (var j=0; j<this.cameras.length; j++){
			if (id==this.cameras[j].id){
				exists = true;
				break;
			}
		}
		
		if (!exists){
			var view = new MyView(this.scene);
			
			view.id = id;
			view.near = this.reader.getFloat(perspective, 'near');
			view.far = this.reader.getFloat(perspective, 'far');
			view.angle = this.reader.getFloat(perspective, 'angle');

			//get from - x y z
			search = perspective.getElementsByTagName('from');
			
			var fromp = search[0];
			if (fromp == null)
				return "no perspective (from failed)";

				
			view.from_ = this.getCoordFromDSX(fromp);

			//get to - x y z
			search = perspective.getElementsByTagName('to');

			var to = search[0];

			if (to == null)
				return "no perspective (to failed)";

			view.to = this.getCoordFromDSX(to);
			
			this.cameras.push(view);
		}
		this.default_view = this.cameras[0];
		
	}

};

/* ILLUMINATION PARSER 
-Global illumination 
-Background
*/

MySceneGraph.prototype.parseDSXIllumination = function (rootElement){

	var search = rootElement.getElementsByTagName('illumination');

	var illumination = search[0];

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

	var search = rootElement.getElementsByTagName('lights');

	var lights = search[0];

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
	
	var texture = textures.getElementsByTagName('texture');
	
	//se "textures" não tem filhos
	if (texture.length == 0)
		return this.onXMLError("Texture element is missing");
	
	var exists;
	var tex;
	var id;
	
	for (var i=0; i<texture.length; i++){
		
		exists=false;
		
		search = texture[i];
		
		id = this.reader.getString(search, 'id');
		
		for (var j=0; j<this.textures.length; j++){
			if (id==this.textures[j].id){
				exists=true;
				break;
			}
		}
		
		if (!exists){
			tex = new MyTexture(this.scene);
			tex.id=id;
			tex.file = this.reader.getString(search, 'file');
			tex.length_s = this.reader.getFloat(search, 'length_s');
			tex.length_t = this.reader.getFloat(search, 'length_t');
			this.textures.push(tex);
		}
		console.log(this.textures);
		
	}
};

/* MATERIALS PARSER 
 *
 */
MySceneGraph.prototype.parseDSXMaterials = function (rootElement){
	
	var search = rootElement.getElementsByTagName('materials');
	
	var material = search[0].getElementsByTagName('material');
	
	//se "materials" não tem filhos
	if (material.length == 0)
		return this.onXMLError("Material element is missing");
	
	var exists, mat, id;
	
	for (var i=0; i<material.length; i++){
		
		exists = false;
		
		search = material[i];
		
		id=this.reader.getString(search, 'id');
		
		for (var j=0; j<this.materials.length; j++){
			if (id==this.materials[j].id){
				exists=true;
				break;
			}
		}
		
		if (!exists){
			
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
		
		console.log(this.materials);
	}
};


/* TRANSFORMATIONS PARSER 
 *
 */
MySceneGraph.prototype.parseDSXTransformations = function (rootElement){
	
	var search = rootElement.getElementsByTagName('transformations');
	
	var transformation = search[0].getElementsByTagName('transformation');
	
	//se "transformations" não tem filhos
	if (transformation.length == 0)
		return this.onXMLError("Transformation element is missing");
	
	
	var matrix, translate, scale, aux, id, exists, transf;
	var rotate = [];
	
	for (var i=0; i<transformation.length; i++){
		
		exists=false;
		
		search = transformation[i];
		
		id = this.reader.getString(search, 'id');
		
		for(var j=0; j<this.transformations.length; j++){
			if (id==this.transformations[j].id){
				exists=true;
				break;
			}
		}
		
		if (!exists){
			
			transf = new MyTransformation(this.scene);
			
			var list = search.children;
			
			//if no transformations are found
			if (list.length == 0)
				return this.onXMLError("no transformations can be read");
			
			//cria matriz identidade para as transformações
			matrix = mat4.create();
					
			for (var j=list.length-1; j>=0; j--){
			//for (var j=0; j<list-length; j++){
				if (list[j].nodeName == 'translate'){
						translate = this.getCoordFromDSX(list[j]);
						mat4.translate(matrix, matrix, translate);
				}
				
				else if(list[j].nodeName == 'rotate'){
					aux = this.getRotateFromDSX(list[j]);
					rotate.push(aux[0], aux[1], aux[2]);
					mat4.rotate(matrix, matrix, aux[3],rotate);
				}
				
				else if (list[j].nodeName == 'scale'){
					scale = this.getCoordFromDSX(list[j]);
					mat4.scale(matrix, matrix, scale);
				}
				else return this.onXMLError("There can only be translate, rotate or scale transformations");
			}	
			
			transf.id=id;
			transf.matrix = mat4.clone(matrix);
			
			this.transformations.push(transf);
		}		
		console.log(this.transformations);
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

	this.verifyOrder(rootElement);
	
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

	if(r == null){
		return this.onXMLError("missing component 'r''");
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
