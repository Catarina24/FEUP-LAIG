/**
 * MyLinearAnimation
 * @constructor
 */

function MyLinearAnimation(scene, id, span, controlPoints){ // span == time

    MyAnimation.call(this, scene, id, span);

    this.controlPoints = controlPoints;

    this.distancesBetweenPoints = [];
    this.totalDistance = 0;

    this.currentDistance = 0;
    this.myCurrentTime = 0;

    console.log(this);

    this.segmentsCumulativeDistance = [];   // distance of the segment i + total distance traveled before the segment i 

    this.calculateDistance();

    this.velocity = this.totalDistance / this.time;

    console.log("Initialization of animation: ");
    console.log(this);
}

MyLinearAnimation.prototype = Object.create(MyAnimation.prototype);
MyLinearAnimation.prototype.constructor = MyLinearAnimation;

MyLinearAnimation.prototype.calculateDistance = function (){
    
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
MyLinearAnimation.prototype.apply = function(time){

    if(time >= this.time)
    {
        this.myCurrentTime = this.time;   // stay in final position after animation is complete
    }
    
    else
    {
        console.log("Time is smaller than current time!");
        this.myCurrentTime = time;
        console.log("Current time after changes: ");
        console.log(this.myCurrentTime);
        console.log("Time: ");
        console.log(time);

        console.log("Animation after changes: ");
        console.log(this);
        
    }

    //this.currentDistance = this.velocity * this.myCurrentTime;

    var currentSegment = 0;

    // increase currentSegment index until we find the current segment
    for( ; currentSegment < this.segmentsCumulativeDistance.length; currentSegment++)
    {
        if(this.currentDistance > this.segmentsCumulativeDistance[currentSegment])
            break;
    }

    var point1 = this.controlPoints[currentSegment];
    var point2 = this.controlPoints[currentSegment+1];

    if(point1 != null && point2 != null)
    {
        console.log(time);

        var vector = vec3.create(); // displacement vector

        vec3.subtract(vector, point2, point1);

        this.scene.translate(vector[0]*velocity, vector[1]*velocity, vector[2]*velocity);
    }

}

