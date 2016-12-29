/**
 * MyInterface
 * @constructor
 */
 
 
function MyInterface() {
	//call CGFinterface constructor 
	CGFinterface.call(this);
};

MyInterface.prototype = Object.create(CGFinterface.prototype);
MyInterface.prototype.constructor = MyInterface;

/**
 * init
 * @param {CGFapplication} application
 */
MyInterface.prototype.init = function(application) {
	// call CGFinterface init
	CGFinterface.prototype.init.call(this, application);
	
	// init GUI. For more information on the methods, check:
	//  http://workshop.chromeexperiments.com/examples/gui
	
	this.gui = new dat.GUI();

	// add a button:
	// the first parameter is the object that is being controlled (in this case the scene)
	// the identifier 'doSomething' must be a function declared as part of that object (i.e. a member of the scene class)
	// e.g. LightingScene.prototype.doSomething = function () { console.log("Doing something..."); }; 

	/*appearanceGroup.add(this.scene, 'DroneBodyAppearance', this.scene.droneAppearanceList);
	appearanceGroup.add(this.scene, 'DroneLegAppearance', this.scene.droneAppearanceList);
	appearanceGroup.add(this.scene, 'DroneHeliceAppearance',  this.scene.droneAppearanceList);*/

	//this.gui.add(this.scene, 'AnimateClock');	

	// add a slider
	// must be a numeric variable of the scene, initialized in scene.init e.g.
	// this.RotationFactor=3;
	// min and max values can be specified as parameters
	
	//this.gui.add(this.scene, 'RotationFactor', 0.1, 2);

	return true;
};

MyInterface.prototype.addLightsMenu = function(lights, numOfLights){
	var lightGroup=this.gui.addFolder('Lights');
		
	lightGroup.open();
	
	for (var i = 0; i < numOfLights; i++)
	{
		lightGroup.add(this.scene, lights[i].id);
	}
	/*lightGroup.add(this.scene, 'light0');
	lightGroup.add(this.scene, 'light1');
	lightGroup.add(this.scene, 'light2');
	lightGroup.add(this.scene, 'light3');*/
}

MyInterface.prototype.processKeyDown = function(event) {
	// call CGFinterface default code (omit if you want to override)
	CGFinterface.prototype.processKeyDown.call(this,event);
	
	switch (event.keyCode)
	{
		case (77):	
		case (77+32):	// 'M' or 'm'
			this.scene.materialCounter++;
			break;
		case(86):
		case(86+32):	// 'D' or 'd'
			this.scene.viewCounter++;
			this.scene.changeCamera(this.scene.viewCounter);
			break;
		case(90):
		case(90+32):	// 'Z' or 'z'
			this.scene.game.undo();
			break;
	};
}

MyInterface.prototype.processMouseDown = function (event) {

	CGFinterface.prototype.processMouseDown.call(this, event);

	var pressedButton = event.which - 1; // 0 is left button, 1 is wheel button and 2 is right button

	switch(pressedButton)
	{
		case(0): 
			console.log("Pressed left button!");
			break;

		case(1): 
			console.log("Pressed wheel button!");
			break;

		case(2): 
			console.log("Pressed right button!");
			break;
	}
}