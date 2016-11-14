/**
 * MyCircularAnimation
 * @constructor
 */

function MyCircularAnimation(scene, id, span, center, radius, startAngle, rotAngle){

    MyAnimation.call(this, scene, id, span);

    this.center = center;
    this.radius = radius;
    this.startAngle = startAngle;
    this.rotAngle = rotAngle;
}

MyCircularAnimation.prototype = Object.create(MyAnimation.prototype);
MyCircularAnimation.prototype.constructor = MyCircularAnimation;