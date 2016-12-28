/**
 * MyKeyAnimation
 * @constructor
 */

/**
 * keyFrame is a class that will hold the images used for the Key animation. translateVector and scaleVector must be an array with 3 elements and rotateVector with 4
 */
class KeyFrame {
	constructor(translationVector, rotationVector) {
		this.translationVector = translationVector;
        this.rotationVector = rotationVector;
	}
}

/**
 * One keyFrameQuadruple is used to interpolate a path between 2 frames. It will be used with Beziers interpolation.
 */
class KeyFrameQuadruple {
    constructor(initialFrame, controlFrame1, controlFrame2, finalFrame)
    {
        this.initialFrame = initialFrame;
        this.controlFrame1 = controlFrame1;
        this.controlFrame2 = controlFrame2;
        this.finalFrame = finalFrame;
    }
}

/**
 * To move PIECES around the game
 */
function MyKeyAnimation(scene, id, span, controlKeyFramesQuadruple){ // span == totalTime

    MyAnimation.call(this, scene, id, span);

    this.controlKeyFramesQuadruple = controlKeyFramesQuadruple;

    this.startTime = 0;
    this.currentTime = 0;
}

MyKeyAnimation.prototype = Object.create(MyAnimation.prototype);
MyKeyAnimation.prototype.constructor = MyKeyAnimation;

MyKeyAnimation.prototype.start = function (startTime)
{
    this.startTime = startTime;
}

/** Function to determine what should the animation do according to the time that has passed **/
MyKeyAnimation.prototype.apply = function(sceneTime){

    this.currentTime = sceneTime - this.startTime;

    if(this.currentTime > this.totalTime)
    {
        return 0;   // animation ended
    }

    var timeRatio = this.currentTime / this.totalTime; // to keep time between 0 and 1 
    
    var berp = this.keyFrameQuadrupleInterpolation(timeRatio, this.controlKeyFramesQuadruple);

    this.scene.translate(berp.translationVector[0], berp.translationVector[1], berp.translationVector[2]);
    this.scene.rotate(berp.rotationVector[0], berp.rotationVector[1], berp.rotationVector[2], berp.rotationVector[3]);
}

/**
 * Beizer interpolation with 4 points in function of time interval t (between 0 and 1) and keyFrameQuadruple
 */
MyKeyAnimation.prototype.keyFrameQuadrupleInterpolation = function (t, keyFrameQuadruple) {

    console.log(keyFrameQuadruple);

    if(!keyFrameQuadruple instanceof KeyFrameQuadruple)
    {
        console.error("Bad keyFrameQuadruple argument on bezierInterpolation.");
        return;
    }
    if(t < 0 || t > 1)
    {
        console.error("Time should be between 0 and 1 on bezierInterpolation.");
        return;
    }

    var start = keyFrameQuadruple.initialFrame;
    var c1 = keyFrameQuadruple.controlFrame1;
    var c2 = keyFrameQuadruple.controlFrame2;
    var end = keyFrameQuadruple.finalFrame;

    var newTranslationVector = [];
    newTranslationVector[0] =   start.translationVector[0] * Math.pow(1-t, 3) + 
                                c1.translationVector[0] * t * Math.pow(1-t, 2) + 
                                c2.translationVector[0] * Math.pow(t, 2)*(1-t) + 
                                end.translationVector[0] * Math.pow(t, 3); 

    newTranslationVector[1] =    start.translationVector[1] * Math.pow(1-t, 3) + 
                                c1.translationVector[1] * t * Math.pow(1-t, 2) + 
                                c2.translationVector[1] * Math.pow(t, 2)*(1-t) + 
                                end.translationVector[1] * Math.pow(t, 3); 
    
    newTranslationVector[2] =    start.translationVector[2] * Math.pow(1-t, 3) + 
                                c1.translationVector[2] * t * Math.pow(1-t, 2) + 
                                c2.translationVector[2] * Math.pow(t, 2)*(1-t) + 
                                end.translationVector[2] * Math.pow(t, 3); 

    // Only changes w, which corresponds to the angle. xyz is which axis it should rotate on
    var newRotationVector = [];
    newRotationVector[0] = start.rotationVector[0] * Math.pow(1-t, 3) + c1.rotationVector[0] * t * Math.pow(1-t, 2) + c2.rotationVector[0] * Math.pow(t, 2)*(1-t) + end.rotationVector[0] * Math.pow(t, 3); 
    
    newRotationVector[1] = start.rotationVector[1];
    newRotationVector[2] = start.rotationVector[2];
    newRotationVector[3] = start.rotationVector[3];

    return new KeyFrame(newTranslationVector, newRotationVector);
}
