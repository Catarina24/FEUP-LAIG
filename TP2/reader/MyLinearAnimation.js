/**
 * MyLinearAnimation
 * @constructor
 */

function MyLinearAnimation(scene, id, span, controlPoints){ // span == totalTime

    MyAnimation.call(this, scene, id, span);

    this.controlPoints = controlPoints;

    this.firstPoint = this.controlPoints[0];
    this.lastPoint = this.controlPoints[this.controlPoints.length - 1];

    this.currentDistance = 0.0;
    this.currentTime = 0.0;

   
    this.distancesBetweenPoints = [];
    this.segmentsCumulativeDistance = [];   // distance of the segment i + total distance traveled before the segment i 
    
    this.totalDistance = 0.0;

    this.calculateDistance();

    this.velocity = this.totalDistance / this.totalTime;

    this.angleOfRotation = 0;
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

    if(this.end)
    {
        return;
    }

    // If there is only 1 control point, the object should be moved to that point for the duration of the animation
    if (this.controlPoints.length == 1) 
    {
         this.scene.translate(this.firstPoint[0], this.firstPoint[1], this.firstPoint[2]);
    }
    
    // If the object has to follow a certain path
    else{

        this.currentDistance = this.velocity * sceneTime;   // distance traveled since the begginning of the animation

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
            
            var lastSegmentDist = 0;
            if (currentSegment > 0) // was THIS.currentSegment, so it was giving errors making the animation jump
                lastSegmentDist = this.segmentsCumulativeDistance[currentSegment - 1];
            
            var aux = this.segmentsCumulativeDistance[currentSegment] - lastSegmentDist;
        
            var percentageTraveled = (this.currentDistance - lastSegmentDist) / aux;

            this.scene.translate(vector[0]*percentageTraveled + point1[0], vector[1]*percentageTraveled + point1[1], vector[2]*percentageTraveled + point1[2]); // make object travel current segment
            this.scene.translate(this.firstPoint[0], this.firstPoint[1], this.firstPoint[2]); // make translations according to the FIRST control point

            this.angleOfRotation = Math.atan2(vector[2], vector[0]);

            this.scene.rotate(-this.angleOfRotation, 0, 1, 0);
        }    

    }

}

MyLinearAnimation.prototype.endAnimation = function(node)
{
    if(!this.end)
    {    
        var finalTranslate = vec3.create();

        vec3.add(finalTranslate, this.firstPoint, this.lastPoint);
        mat4.translate(node.mat, node.mat, finalTranslate);

        mat4.rotate(node.mat, node.mat, -this.angleOfRotation, [0, 1, 0]);
    }

    this.end = true;
}


