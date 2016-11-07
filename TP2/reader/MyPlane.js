/**
 * MyPlane
 * @constructor
 */

function MyPlane(scene, dimX, dimY, partsX, partsY){
    /** 
     * constructor CGFnurbsObject
     * new CGFnurbsObject (a, b, c, d)
     * a - scene
     * b - função que retorna os pontos
     * c - slices
     * d - stacks
    */
    /** 
     * constructor CGFnurbsSurface
     * new CGFnurbsSurface (g1, g2, knots1, knots2, controlPoints)
     * g1 - grau em u (corresponde a x)
     * g2 -grau em v (corresponde a v)
     * knots1 = controlPoints[i].length + g1 + 1
     * knots2 = controlPoints[i].length + g2 + 1
     * d - stacks
    */
    
        this.scene = scene;
        this.dimX = dimX;
        this.dimY = dimY;
        this.partsX = partsX;
        this.partsY = partsY;

        var knots = [0, 0, 1, 1];

        //http://pastebin.com/WyKHmm1P
        this.controlPoints = [
            [
                [-dimX/2, -dimY/2, 0, 1], //controlPoint = [x, y, z, w], w = weight of controlPoint, w = 1;
                [-dimX/2, dimY/2, 0, 1]
            ],

            [
                [dimX/2, -dimY/2, 0, 1],
                [dimX/2, dimY/2, 0, 1]
            ]

        ];

        var nurbsSurface = new CGFnurbsSurface(1, 1, knots, knots, this.controlPoints);

        getSurfacePoint = function(u, v) {
                return nurbsSurface.getPoint(u, v);
        };

        this.plane = new CGFnurbsObject(this.scene, getSurfacePoint, partsX, partsY);

        //this.initBuffers();
    
}

MyPlane.prototype = Object.create(CGFobject.prototype);
MyPlane.prototype.constructor = MyPlane;

MyPlane.prototype.display = function() {
		this.plane.display();
}