/**
 * Triangle
 * @constructor
 */
function Triangle(scene, point1, point2, point3) {
    CGFobject.call(this, scene);

    this.point1 = point1;
    this.point2 = point2;
    this.point3 = point3;

    this.initBuffers();
};

Triangle.prototype = Object.create(CGFobject.prototype);
Triangle.prototype.constructor = Triangle;

Triangle.prototype.initBuffers = function() {
    this.vertices = [
        this.point1.x, this.point1.y, this.point1.z,
        this.point2.x, this.point2.y, this.point2.z,
        this.point3.x, this.point3.y, this.point3.z
    ];

    this.indices = [
        0, 1, 2,
    ];

    this.primitiveType = this.scene.gl.TRIANGLES;


    this.normals = [
        0, 0, 1,
        0, 0, 1,
        0, 0, 1,
    ];


    var properties = this.getVectorsProperties(this.makeVector(this.point2, this.point1),
        this.makeVector(this.point2, this.point3));


    this.texCoords = [
      0, 1,
      properties[0], 1,
      properties[0] - properties[1] * Math.cos(properties[2]), 1 - (properties[1] * Math.sin(properties[2]))
    ]

    this.initGLBuffers();
};


Triangle.prototype.makeVector = function(point1, point2) {
    return new Point3(point2.x - point1.x, point2.y - point1.y, point2.z - point1.z)
}

Triangle.prototype.dotProduct = function(point1, point2) {
    return (point1.x * point2.x) + (point1.y * point2.y) + (point1.z * point2.z);
}

Triangle.prototype.calculateLength = function(vec) {
    return Math.sqrt((vec.x * vec.x) + (vec.y * vec.y) + (vec.z * vec.z));
}

Triangle.prototype.getVectorsProperties = function(vec1, vec2) {
    var length1 = this.calculateLength(vec1);
    var length2 = this.calculateLength(vec2);
    var dot = this.dotProduct(vec1, vec2);
    var angle = Math.acos(dot / (length1 * length2));

    return [length1, length2, angle];
}
