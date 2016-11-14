/**
 * MyVehicle
 * @constructor
 */
 function MyVehicle(scene) {
 	CGFobject.call(this,scene);

    this.cylinder = new MyCylinder(scene, 30, 20, this.dimension, this.dimension/2, this.dimension/2);
    this.cube = new MyCube(scene, 1, 20, 20);

    var controlpoints = [	// U = 0
                            [ // V = 0..1;
                                [ -1.5, -1.5, 0.0, 1 ],
                                [ -1.5,  1.5, 0.0, 1 ]
                                
                            ],
                            // U = 1
                            [ // V = 0..1
                                [ 0, -1.5, 3.0, 1 ],
                                [ 0,  1.5, 3.0, 1 ]							 
                            ],
                            // U = 2
                            [ // V = 0..1							 
                                [ 1.5, -1.5, 0.0, 1 ],
                                [ 1.5,  1.5, 0.0, 1 ]
                            ]
					    ];    
    this.patch = new MyPatch(scene, 2, 1, 20, 20, controlpoints);
 	this.initBuffers();
 };

 MyVehicle.prototype = Object.create(CGFobject.prototype);
 MyVehicle.prototype.constructor = MyVehicle;

 MyVehicle.prototype.display = function(){
 	
     this.scene.pushMatrix();
        this.cube.display();
     this.scene.popMatrix();


    /*
 	//base
 	this.scene.pushMatrix();
 		this.scene.rotate(Math.PI, 0, 0, 1);
 		this.scene.rotate(Math.PI, 0, 1, 0);
 		this.base.display();
 	this.scene.popMatrix();

     //topo
 	this.scene.pushMatrix();
 		this.scene.translate(0, 0, this.height);
 		this.top.display();
 	this.scene.popMatrix();*/
 }