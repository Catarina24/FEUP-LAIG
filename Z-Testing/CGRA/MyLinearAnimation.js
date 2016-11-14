/**
 * MyLinearAnimation
 * @constructor
 */

function MyLinearAnimation(scene, id, span, controlPoints){ // span == totalTime

    MyAnimation.call(this, scene, id, span);

    this.currentDistance = 0.0;
    this.currentTime = 0.0;

    this.controlPoints = controlPoints;

    

    this.distancesBetweenPoints = [];
    this.totalDistance = 0.0;
    
    console.log(this);

    this.segmentsCumulativeDistance = [];   // distance of the segment i + total distance traveled before the segment i 

    this.calculateDistance();

    this.velocity = this.totalDistance / this.totalTime;

    console.log("Initialization of animation: ");
    console.log(this);
}

MyLinearAnimation.prototype = Object.create(MyAnimation.prototype);
MyLinearAnimation.prototype.constructor = MyLinearAnimation;

MyLinearAnimation.prototype.calculateDistance = function (){

    this.segmentsCumulativeDistance.push(0);
    
    for(var i = 0; i < this.controlPoints.length - 1; i++)
    {
        var point1 = vec3.fromValues(this.controlPoints[i][0], this.controlPoints[i][1], this.controlPoints[i][2]); // x,y,z
        var point2 = vec3.fromValues(this.controlPoints[i+1][0], this.controlPoints[i+1][1], this.controlPoints[i+1][2]); // x,y,z

        var distance = vec3.distance(point1, point2);

        this.totalDistance += distance;

        this.segmentsCumulativeDistance.push(this.totalDistance);
        this.distancesBetweenPoints.push(distance);
    }

}

/** Function to determine what should the animation do according to the time that has passed **/
MyLinearAnimation.prototype.applyChanges = function(sceneTime){

    if(sceneTime > this.totalTime)
    {
        sceneTime = this.totalTime;  // stay in final position after animation is complete
    }   

    console.log("Scene time: ");
    console.log(sceneTime);

    this.currentDistance = this.velocity * sceneTime;

    console.log("Current distance: ");
    console.log(this.currentDistance);

    console.log("Animation: ");
    console.log(this);

    var currentSegment = 0;

    console.log("Segments: ");
    console.log(this.segmentsCumulativeDistance);

    // increase currentSegment index until we find the current segment
    for( ; currentSegment < this.segmentsCumulativeDistance.length; currentSegment++)
    {
        if(this.currentDistance > this.segmentsCumulativeDistance[currentSegment])
            break;
    }

    var point1 = this.controlPoints[currentSegment];
    var point2 = this.controlPoints[currentSegment+1];

    console.log("Pontos: ");
    console.log(point1);
    console.log(point2);

    if(point1 != null && point2 != null)
    {
        var vector = vec3.create(); // displacement vector

        vec3.subtract(vector, point2, point1);

        this.scene.translate(vector[0]*this.velocity, vector[1]*this.velocity, vector[2]*this.velocity);
    }

}

