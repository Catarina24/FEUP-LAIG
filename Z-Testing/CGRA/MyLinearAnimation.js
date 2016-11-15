/**
 * MyLinearAnimation
 * @constructor
 */

function MyLinearAnimation(scene, id, span, controlPoints){ // span == totalTime

    MyAnimation.call(this, scene, id, span);

    this.controlPoints = controlPoints;

    this.currentDistance = 0.0;
    this.currentTime = 0.0;

   
    this.distancesBetweenPoints = [];
    this.segmentsCumulativeDistance = [];   // distance of the segment i + total distance traveled before the segment i 
    
    this.totalDistance = 0.0;

    this.calculateDistance();

    this.velocity = this.totalDistance / this.totalTime;
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
MyLinearAnimation.prototype.apply = function(sceneTime){

    if(sceneTime > this.totalTime)  // if the animation time has ended
    {
        // translate to final position
        this.scene.translate(   this.controlPoints[this.controlPoints.length-1][0], 
                                this.controlPoints[this.controlPoints.length-1][1], 
                                this.controlPoints[this.controlPoints.length-1][2]); // put in final position (last point of the controlPoints array)

        console.log("Animation ended.");
    }   

    else if (this.controlPoints.length == 1) // If there is only 1 control point, the object should be moved to that point for the duration of the animation
    {
         this.scene.translate(this.controlPoints[0][0], this.controlPoints[0][1], this.controlPoints[0][2]);
    }
    
    else{

        this.currentDistance = this.velocity * sceneTime;
        console.log()

        var currentSegment = 0;

        // increase currentSegment index until we find the current segment
        for( ; currentSegment < this.segmentsCumulativeDistance.length; currentSegment++)
        {  
            if(this.currentDistance <= this.segmentsCumulativeDistance[currentSegment])
                break;
        }
        

        var point1 = this.controlPoints[currentSegment];
        var point2 = this.controlPoints[currentSegment+1];

        if(point1 != null && point2 != null)
        {
            var vector = vec3.create(); // displacement vector

            vec3.subtract(vector, point2, point1);
            console.log("Vector:");
            console.log(vector);

            var lastSegmentDist = 0;
            if (this.currentSegment > 0)
                lastSegmentDist = this.segmentsCumulativeDistance[currentSegment - 1];
            
            var aux = this.segmentsCumulativeDistance[currentSegment] - lastSegmentDist;
            console.log("Current segment cumulative distance: ");
            console.log(this.segmentsCumulativeDistance[currentSegment]);

            console.log("lastSegmentDist: ");
            console.log(lastSegmentDist);

            var percentageTraveled = (this.currentDistance - lastSegmentDist) / aux;

            console.log("Current distance: ");
            console.log(this.currentDistance);

            console.log("Percentage traveled: ");
            console.log(percentageTraveled);
           
            this.scene.translate(vector[0]*percentageTraveled + point1[0], vector[1]*percentageTraveled + point1[1], vector[2]*percentageTraveled + point1[2]);
            //this.scene.translate(this.controlPoints[0][0], this.controlPoints[0][1], this.controlPoints[0][2]); // make translations according to the FIRST control point
        }    

    }

}

