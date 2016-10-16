/**
 * Rectangle
 * @constructor
 */
function Rectangle(scene, point1, point2, minS = 0, maxS = 1, minT = 0, maxT = 1) {
    CGFobject.call(this, scene);

    this.point1 = point1;
    this.point2 = point2;

    this.minS = minS;
    this.maxS = maxS;
    this.minT = minT;
    this.maxT = maxT;

    this.initBuffers();
};

Rectangle.prototype = Object.create(CGFobject.prototype);
Rectangle.prototype.constructor = Rectangle;

Rectangle.prototype.initBuffers = function() {
    this.vertices = [
        this.point1.x, this.point1.y, 0,
        this.point2.x, this.point1.y, 0,
        this.point2.x, this.point2.y, 0,
        this.point1.x, this.point2.y, 0
    ];

    this.indices = [
        0, 1, 2,
        2, 3, 0
    ];

    this.primitiveType = this.scene.gl.TRIANGLES;


    this.normals = [
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
        0, 0, 1
    ]

    this.texCoords = [
        this.minS, this.maxT,
        this.maxS, this.maxT,
        this.maxS, this.minT,
        this.minS, this.minT
    ]

    this.initGLBuffers();
};
