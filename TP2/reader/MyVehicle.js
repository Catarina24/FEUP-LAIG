/**
 * MyVehicle
 * @constructor
 */
 function MyVehicle(scene) {
 	CGFobject.call(this,scene);
    
    this.dimension = 1;
    this.cylinder = new MyCylinder(scene, 30, 20, this.dimension, this.dimension/2, this.dimension/2);
    this.cube = new MyCube(scene, 1, 20, 20);

    var controlpoints = [	// U = 0
                            [ // V = 0..1;
                                [ -0.5, -0.5, 0.0, 1 ],
                                [ -0.5,  0.5, 0.0, 1 ]
                                
                            ],
                            // U = 1
                            [ // V = 0..1
                                [ 0, -0.5, 0.5, 1 ],
                                [ 0,  0.5, 0.5, 1 ]							 
                            ],
                            // U = 2
                            [ // V = 0..1							 
                                [ 0.5, -0.5, 0.0, 1 ],
                                [ 0.5,  0.5, 0.0, 1 ]
                            ]
					    ];    
    this.patch = new MyPatch(scene, 2, 1, 20, 20, controlpoints);
 	this.initBuffers();
 };

 MyVehicle.prototype = Object.create(CGFobject.prototype);
 MyVehicle.prototype.constructor = MyVehicle;

 MyVehicle.prototype.display = function(){
 	
 	 //carruagem
     this.scene.pushMatrix();
        this.cube.display();
     this.scene.popMatrix();

     //teto carruagem
     this.scene.pushMatrix();
        this.scene.translate(0, 0.5, 0);
        this.scene.rotate(-Math.PI/2, 1, 0, 0);
        this.patch.display();
     this.scene.popMatrix();
      
     //parte da frete que suporta o cilindro
     this.scene.pushMatrix();
        this.scene.translate(0, -0.35, 1);
        this.scene.scale(1, 0.3, 1);
        this.cube.display();
     this.scene.popMatrix();

     //cilindro
     this.scene.pushMatrix();
        this.scene.translate(0, 0.05, 0.5);
        this.scene.scale(0.6, 0.6, 1);
        this.cylinder.display();
     this.scene.popMatrix();


      //roda maior direita
     this.scene.pushMatrix();
       this.scene.translate(0.5, -0.5, 0);
       this.scene.scale(0.1, 1, 1);
       this.scene.rotate(Math.PI/2, 0, 1, 0);
       this.cylinder.display();
     this.scene.popMatrix();

     //roda maior esquerda
     this.scene.pushMatrix();
       this.scene.translate(-0.5, -0.5, 0);
       this.scene.scale(0.1, 1, 1);
       this.scene.rotate(Math.PI/2, 0, 1, 0);
       this.cylinder.display();
     this.scene.popMatrix();

    //rodas da direita
    this.scene.pushMatrix();
       this.scene.translate(0.4, -0.75, 0.73);
       this.scene.scale(0.1, 0.5, 0.5);
       this.scene.rotate(Math.PI/2, 0, 1, 0);
       this.cylinder.display();
     this.scene.popMatrix();

    this.scene.pushMatrix();
       this.scene.translate(0.4, -0.75, 1.25);
       this.scene.scale(0.1, 0.5, 0.5);
       this.scene.rotate(Math.PI/2, 0, 1, 0);
       this.cylinder.display();
     this.scene.popMatrix();

    //rodas da esquerda
    this.scene.pushMatrix();
       this.scene.translate(-0.4, -0.75, 0.73);
       this.scene.scale(0.1, 0.5, 0.5);
       this.scene.rotate(Math.PI/2, 0, 1, 0);
       this.cylinder.display();
     this.scene.popMatrix();

    this.scene.pushMatrix();
       this.scene.translate(-0.4, -0.75, 1.25);
       this.scene.scale(0.1, 0.5, 0.5);
       this.scene.rotate(Math.PI/2, 0, 1, 0);
       this.cylinder.display();
     this.scene.popMatrix();
   
 }