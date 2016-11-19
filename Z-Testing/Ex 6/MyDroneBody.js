/**
 * MyDroneBody
 * @constructor
 */
 function MyDroneBody(scene) {
 	CGFobject.call(this,scene);
	
	this.crossedArm = new MyCylinder(scene, 8, 2); 
	this.helSupport = new MyCylinder(scene, 8, 1); 
	this.mainBody = new MySemiSphere(scene, 8, 12);

	//Drone's hood which is on the north facing side
	p0 = [-0.5, -1];
	p1 = [0.5, -1];
	p = [0, -1.25];
	this.hood = new MyArch(scene, p0, p1, p,0.5);

	this.hoodAppearance = new CGFappearance(scene);
	this.hoodAppearance.loadTexture("../resources/images/North.png");
	this.hoodAppearance.setTextureWrap('CLAMP_TO_EDGE', 'CLAMP_TO_EDGE');	
	this.hoodAppearance.setDiffuse(0.3, 0.3, 0.3,1);
	this.hoodAppearance.setSpecular(0.6, 0.6, 0.6,1);	
	this.hoodAppearance.setShininess(20);
 };

MyDroneBody.prototype = Object.create(CGFobject.prototype);
MyDroneBody.prototype.constructor = MyDroneBody;

MyDroneBody.prototype.display = function() {
	//Arms
	//Arm paralel to z axis
	this.scene.pushMatrix();
	this.scene.translate(0, 0, -2.5);
	this.scene.scale(0.2, 0.15, 5);
	this.crossedArm.display();
	this.scene.popMatrix();

	//Arm paralel to X axis
	this.scene.pushMatrix();
	this.scene.translate(2.5, 0, 0);
	this.scene.rotate(-90 * degToRad, 0, 1, 0)
	this.scene.scale(0.2, 0.15, 5);
	this.crossedArm.display();
	this.scene.popMatrix();

	//Helices support

	//support at negative z axis
	this.scene.pushMatrix();
	this.scene.translate(0, -0.20, -2.85);
	this.scene.scale(0.40, 0.40, 0.40);
	this.scene.rotate(-90 * degToRad, 1, 0, 0)
	this.helSupport.display();
	this.scene.popMatrix();

	//support at positive z axis
	this.scene.pushMatrix();
	this.scene.translate(0, -0.20, 2.85);
	this.scene.scale(0.40, 0.40, 0.40);
	this.scene.rotate(-90 * degToRad, 1, 0, 0)
	this.helSupport.display();
	this.scene.popMatrix();
	
	//support at positive x axis
	this.scene.pushMatrix();
	this.scene.translate(2.85, -0.20, 0);
	this.scene.scale(0.40, 0.40, 0.40);
	this.scene.rotate(-90 * degToRad, 1, 0, 0)
	this.helSupport.display();
	this.scene.popMatrix();

	//support at negative x axis
	this.scene.pushMatrix();
	this.scene.translate(-2.85, -0.20, 0);
	this.scene.scale(0.40, 0.40, 0.40);
	this.scene.rotate(-90 * degToRad, 1, 0, 0)
	this.helSupport.display();
	this.scene.popMatrix();

    //Main body
	this.scene.pushMatrix();
	this.scene.translate(0, -0.25, 0);
	this.scene.scale(0.5, 1.2, 0.5);
	this.scene.rotate(-90 * degToRad, 1, 0, 0)
	this.mainBody.display();
	this.scene.popMatrix();

	//Hood
	this.scene.pushMatrix();
	this.scene.translate(-0.30, -0.19, 0);
	this.scene.rotate(90 * degToRad, 0, 1, 0);
	this.scene.rotate(-135 * degToRad, 0, 0, 1);
	this.hoodAppearance.apply();
	this.hood.display();
	this.scene.popMatrix();


}