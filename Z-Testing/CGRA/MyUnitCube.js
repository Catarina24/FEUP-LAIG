/**
 * MyUnitCube
 * @param gl {WebGLRenderingContext}
 * @constructor
 */

 function MyUnitCube(scene){
     CGFobject.call(this, scene);

     this.initBuffers();
 };

MyUnitCube.prototype = Object.create(CGFobject.prototype);
MyUnitCube.prototype.constructor=MyUnitCube;

MyUnitCube.prototype.initBuffers = function () {

    //vertíces do cubo(x, y, z)
    this.vertices = [
        0.5, -0.5, 0.5,     //[x, -y, z]
        -0.5, -0.5, -0.5,   //[-x, -y, -z]    
         0.5, -0.5, -0.5,   //[x, -y, -z]
        -0.5, -0.5, 0.5,    //[-x, -y, z] 
        0.5, 0.5, -0.5,     //[x, y, -z]
        -0.5, 0.5, -0.5,    //[-x, y, -z]
        -0.5, 0.5, 0.5,     //[-x, y, z]
        0.5, 0.5, 0.5       //[x, y, z]
    ]

    this.indices = [
        //face culling -> in order to see the faces the triangle vertices, in order, rotate counterclockwise
        // around the triangle center

        //face inferior
        0, 1, 2,
        3, 1, 0,
        //face superior
        4, 6, 7,
        4, 5, 6,
        //face lateral direita
        0, 2, 7,
        2, 4, 7,
        //face lateral esquerda
        1, 3, 6,
        1, 6, 5,
        //face frontal
        6, 3, 7,
        3, 0, 7, 
        //face traseira
        2, 1, 5,
        2, 5, 4
    ];
    //o objeto é desenhado a partir de triangulos
	this.primitiveType=this.scene.gl.TRIANGLES;
	this.initGLBuffers();
}
