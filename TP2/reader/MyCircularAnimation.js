/**
 * MyCircularAnimation
 * @constructor
 */

function MyCircularAnimation(scene, id, span, center, radius, startAngle, rotAngle){

    MyAnimation.call(this, scene, id, span);

    this.center = center;
    this.radius = radius;
    this.startAngle = this.convertDegreesToRadians(startAngle);
    this.rotAngle = this.convertDegreesToRadians(rotAngle);
    this.velocity = this.rotAngle/this.totalTime; //velocidade angular
    this.lastPoint = [];
    this.angle = 0;
}

MyCircularAnimation.prototype = Object.create(MyAnimation.prototype);
MyCircularAnimation.prototype.constructor = MyCircularAnimation;

MyCircularAnimation.prototype.apply = function(sceneTime){

    if (sceneTime > this.totalTime){

        sceneTime = this.totalTime;
        this.scene.translate(this.lastPoint[0], this.lastPoint[1], this.lastPoint[2]);
        this.scene.rotate(-this.angle, 0, 1, 0);
        /*var matrix = mat4.create();
        return matrix;*/
    }

    else{

        this.angle = this.velocity * sceneTime;

        var x, y;
        x = this.radius * Math.cos(this.angle);
        z = this.radius * Math.sin(this.angle);
    
        this.scene.translate(this.center[0] + x, this.center[1], this.center[2] + z);

        /*var translate = [this.center[0] + x, this.center[1], this.center[2] + z];
        var matrix = mat4.create();
        mat4.translate(matrix, matrix, translate);

        var matrix2 = mat4.create();
        var rotate = [0, 1, 0];
        mat4.rotate(matrix2, matrix2, -this.angle,rotate);*/

        this.lastPoint = [x, this.center[1], z];

        this.scene.rotate(-this.angle, 0, 1, 0);
        //return matrix * matrix2;
        
    }
}

MyCircularAnimation.prototype.convertDegreesToRadians = function(angle){
        return (angle * Math.PI / 180);
}