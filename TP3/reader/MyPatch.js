/**
 * MyPatch
 * @constructor
 */

function MyPatch(scene, orderU, orderV, partsU, partsV, controlPoints){
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
        this.orderU = orderU;
        this.orderV = orderV;
        this.partsU = partsU;
        this.partsV = partsV;

        getKnotsVector = function(degree) { 
	
            var v = new Array();
            for (var i=0; i<=degree; i++) {
                v.push(0);
            }
            for (var i=0; i<=degree; i++) {
                v.push(1);
            }
            return v;
        }

        var knots1 = getKnotsVector(orderU);
        var knots2 = getKnotsVector(orderV);

        this.controlPoints = controlPoints;

        var nurbsSurface = new CGFnurbsSurface(orderU, orderV, knots1, knots2, controlPoints);

        getSurfacePoint = function(u, v) {
                return nurbsSurface.getPoint(u, v);
        };

        this.patch = new CGFnurbsObject(this.scene, getSurfacePoint, partsU, partsV);

        //this.initBuffers();
    
}

MyPatch.prototype = Object.create(CGFobject.prototype);
MyPatch.prototype.constructor = MyPatch;

MyPatch.prototype.display = function() {
		this.patch.display();
}