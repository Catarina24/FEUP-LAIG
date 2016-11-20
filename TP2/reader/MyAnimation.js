/**
 * MyAnimation
 * @constructor
 */

function MyAnimation(scene, id, span){
    this.scene = scene;
    this.id = id;
    this.totalTime = span;
    this.end = false;
}

MyAnimation.prototype.constructor = MyAnimation;

MyAnimation.prototype.apply = function(time){
    
}