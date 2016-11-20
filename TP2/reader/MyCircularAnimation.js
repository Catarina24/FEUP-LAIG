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

MyCircularAnimation.prototype.apply = function(sceneTime, node){

    if(this.end)
    {
         return;
    }

    if (sceneTime >= this.totalTime){

        sceneTime = this.totalTime;
        this.scene.translate(this.lastPoint[0], this.lastPoint[1], this.lastPoint[2]);
        this.scene.rotate(this.angle, 0, 1, 0);

        var finalTranslate = vec3.fromValues(this.lastPoint[0], this.lastPoint[1], this.lastPoint[2]);

        console.log("Before:");
        console.log(node.mat);
        
        mat4.translate(node.mat, node.mat, finalTranslate);
        mat4.rotate(node.mat, node.mat, this.angle, [0, 1, 0]);

        console.log("After: ");
        console.log(node.mat);

        this.end = true;
    }

    else{

        this.angle = this.velocity * sceneTime;

        var x, y;
        z = this.radius * Math.cos(this.angle);
        x = this.radius * Math.sin(this.angle);
        /** Switched z with x, because from the positive YY perspective, x is the sin axis and z the cos axis */
    
        this.scene.translate(this.center[0] + x, this.center[1], this.center[2] + z);
        this.lastPoint = [x, this.center[1], z];

        this.scene.rotate(this.angle, 0, 1, 0);

        console.log("Angle: ");
        console.log(this.angle);

        console.log("Scene Time: ");
        console.log(sceneTime);

        console.log("Anim Total Time: ");
        console.log(this.totalTime);
    }
}

MyCircularAnimation.prototype.convertDegreesToRadians = function(angle){
        return (angle * Math.PI / 180);
}