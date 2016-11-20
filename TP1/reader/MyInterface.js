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
 * 
 *	Inicialização da interface. 
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

/*
*
* Função que adiciona o menu para acender/apagar as luzes.
*/
MyInterface.prototype.addLightsMenu = function(lights, numOfLights){

	// Cria o conjunto ao qual as luzes vão pertencer
	var lightGroup=this.gui.addFolder('Lights');

	console.log(lights);
	
	// Inicializa o menu aberto	
	lightGroup.open();
	
	/* Este ciclo adiciona à pasta do lightGroup uma variável com valor TRUE ou FALSE que pertença à this.scene.
	Quando a variável tem valor TRUE, aparece um visto. Ao tirar/meter o visto na interface, está-se a alterar o valor da variável. 
	As variáveis que são utilizadas aqui são criadas no XMLScene.js no findal da função loadLights(). */
	for (var i = 0; i < numOfLights; i++)
	{
		lightGroup.add(this.scene, lights[i].id);
		/* lightGroup.add(this.scene, <nome da variável que tenha valor TRUE ou FALSE>)*/
	}
}

MyInterface.prototype.processKeyDown = function(event) {
	
	// Esta é a função que lida com o evento gerado quando se carrega numa tecla do teclado
	CGFinterface.prototype.processKeyDown.call(this,event);
	
	// Dependendo do keyCode
	switch (event.keyCode)
	{
		case (77):	
		case (77+32):	// 'M' or 'm'
			this.scene.materialCounter++;
			break;

			/* Aumenta o índice do material a ser mostrado. Além disto, uso o módulo na função processGraph na linha que tem:
			var matPosition = this.materialCounter % node.materials.length;

			Isto faz com que o valor aumenta sempre, mas não exceda o número de materiais no nó. */

		case(86):
		case(86+32):	// 'V' or 'v'

			
			this.scene.viewCounter++;
			this.scene.changeCamera(this.scene.viewCounter);
			break;

			/* Mesmo que em cima */

		// KeyCode do 'X': 88, 'x':120
		// KeyCode do 'Y': 89, 'x':121
		// KeyCode do 'Z': 90, 'x':122
		
	};
}
