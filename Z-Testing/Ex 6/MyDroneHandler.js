/**
 * MyDroneHandler
 * @constructor
 */
 function MyDroneHandler(scene, x, y, z, angle) {
 	CGFobject.call(this,scene);

 	this.drone = new MyDrone(scene);

 	this.X = x;
 	this.Y = y;
 	this.Z = z;
 	this.drone.hook.updateCoordinates(this.X/2, this.Y/2, this.Z/2);
 	this.angle = 0;
	
	//Pitch - angles in degrees
	this.pitchAngle = 0;
	this.pitchAngleStep = 1;
	this.pitchCounterAngleStep = this.pitchAngle / 5;

	this.angleStep = 5;
	this.motionVelocity = 0;
	this.floatVelocity = 0;
	this.acceleration = 0.8;
	this.friction = 0.4;
	this.maxVelocity = Math.sqrt(this.acceleration/this.friction);
 	this.maxTime = 2.5/(this.maxVelocity);
 	this.rotationSpeed = {slow: 0.1 * 360, normal: 1 * 360, fast: 10 * 360};
 	this.rotationFactor = 1;

 	this.motionTime = 0;
 	this.motionTimeStart = 0;
 	this.floatTime = 0;
 	this.floatTimeStart = 0;

 	this.motionTrajectory ={
 	      Forward:1,
 	      Backward:2,
 	      Halting:3,
 	      Stopped:4
 	}

 	this.floatTrajectory ={
 	      Upward:1,
 	      Downward:2,
 	      Halting:3,
 	      Stopped:4
 	}

 	this.delivery ={
 	      Collecting:1,
 	      Delivering:2,
 	      Delivered:3,
 	}

 	this.motionState = this.motionTrajectory.Stopped;
 	this.floatState = this.floatTrajectory.Stopped;
 	this.packageState = this.delivery.Collecting;

 	//Animation related methods
	this.initialTime = 0;	// Initial time in miliseconds
    this.elapsedTime = 0;	// Elapsed time in SECONDS
 };

MyDroneHandler.prototype = Object.create(CGFobject.prototype);
MyDroneHandler.prototype.constructor = MyDroneHandler;

MyDroneHandler.prototype.display = function() {
    this.scene.translate(this.X, this.Y, this.Z );
	this.drone.textures[this.drone.legTextureIndex].apply();
	this.drone.hook.display();
    this.scene.rotate(this.angle*degToRad, 0, 1, 0);
	this.scene.rotate(this.pitchAngle*degToRad, 1, 0, 0);
	
    this.drone.display();
}

MyDroneHandler.prototype.rotate = function(orientation){
  this.angle += this.angleStep*orientation;

  if (orientation == 1)
  	this.drone.setHelicesRotationSpeed(this.rotationSpeed.slow, this.rotationSpeed.slow, this.rotationSpeed.fast, this.rotationSpeed.fast);
  else
  	this.drone.setHelicesRotationSpeed(this.rotationSpeed.fast, this.rotationSpeed.fast, this.rotationSpeed.slow, this.rotationSpeed.slow);
}

MyDroneHandler.prototype.staticMovement = function(){
  this.drone.setHelicesRotationSpeed(this.rotationSpeed.normal, this.rotationSpeed.normal, this.rotationSpeed.normal, this.rotationSpeed.normal)
}

MyDroneHandler.prototype.setRotationFactor = function(rotationFactor){
  this.rotationFactor = rotationFactor;
}

MyDroneHandler.prototype.stopMove = function(){
	if(this.motionState == this.motionTrajectory.Forward || this.motionState == this.motionTrajectory.Backward){
		this.motionState = this.motionTrajectory.Halting;
	}
}

MyDroneHandler.prototype.move = function(orientation){
	switch(this.motionState){
		case this.motionTrajectory.Stopped:{
			if(orientation == 1){
				this.motionState = this.motionTrajectory.Forward;
				this.drone.setHelicesRotationSpeed(this.rotationSpeed.slow, this.rotationSpeed.fast, this.rotationSpeed.normal, this.rotationSpeed.normal)
			} else{
			 	this.motionState = this.motionTrajectory.Backward;
			 	this.drone.setHelicesRotationSpeed(this.rotationSpeed.fast, this.rotationSpeed.slow, this.rotationSpeed.normal, this.rotationSpeed.normal)
			}
			this.motionTime = 0;
			this.motionTimeStart = this.elapsedTime;
			break;
		}
		
		case this.motionTrajectory.Halting:{
			this.motionTime = Math.log((-Math.abs(this.motionVelocity) - this.maxVelocity)/(Math.abs(this.motionVelocity) - this.maxVelocity))/(2* Math.sqrt(this.acceleration*this.friction));
			if(sign(orientation) == sign(this.motionVelocity)){
				if(orientation == 1)
					this.motionState = this.motionTrajectory.Forward;
				else this.motionState = this.motionTrajectory.Backward;
			} else{
				if(orientation == 1 && Math.abs(this.motionVelocity) < 0.25){
					this.motionState = this.motionTrajectory.Forward;
					this.drone.setHelicesRotationSpeed(this.rotationSpeed.slow, this.rotationSpeed.fast, this.rotationSpeed.normal, this.rotationSpeed.normal)
				}
				else if(orientation == -1 && Math.abs(this.motionVelocity) < 0.25){
					this.motionState = this.motionTrajectory.Backward;
					this.drone.setHelicesRotationSpeed(this.rotationSpeed.fast, this.rotationSpeed.slow, this.rotationSpeed.normal, this.rotationSpeed.normal)
				}
			}
			this.motionTimeStart = this.elapsedTime;	
			break;
		}
		default: break;
	}
}

MyDroneHandler.prototype.fly = function(orientation){
	switch(this.floatState){
		case this.floatTrajectory.Stopped:{
			if(orientation == 1){
				this.floatState = this.floatTrajectory.Upward;
			} else{
			 	this.floatState = this.floatTrajectory.Downward;
			}
			this.floatTime = 0;
			this.floatTimeStart = this.elapsedTime;
			break;
		}
		
		case this.floatTrajectory.Halting:{
			this.floatTime = Math.log((-Math.abs(this.floatVelocity) - this.maxVelocity)/(Math.abs(this.floatVelocity) - this.maxVelocity))/(2* Math.sqrt(this.acceleration*this.friction));
			if(sign(orientation) == sign(this.floatVelocity)){
				if(orientation == 1)
					this.floatState = this.floatTrajectory.Upward;
				else this.floatState = this.floatTrajectory.Downward;
			} else{
				if(orientation == 1 && Math.abs(this.floatVelocity) < 0.25){
					this.floatState = this.floatTrajectory.Upward;
				}
				else if(orientation == -1 && Math.abs(this.floatVelocity) < 0.25){
					this.floatState = this.floatTrajectory.Downward;
				}
			}
			this.floatTimeStart = this.elapsedTime;	
			break;
		}
		default: break;
	}
}

MyDroneHandler.prototype.stopFly = function(){
	if(this.floatState == this.floatTrajectory.Upward || this.floatState == this.floatTrajectory.Downward){
		this.floatState = this.floatTrajectory.Halting;
	}
}

MyDroneHandler.prototype.retrieveHook = function(){
	this.drone.hook.scaleHook(-0.3);
}

MyDroneHandler.prototype.releaseHook = function(){
	this.drone.hook.scaleHook(0.3);
}

MyDroneHandler.prototype.update = function(currTime){
	if (this.initialTime == 0)
	{
		this.initialTime = currTime;
	}

	else{	
		this.elapsedTime = (currTime - this.initialTime)/1000;
		this.drone.setHelicesAngle(this.elapsedTime, this.rotationFactor);
	
		if(this.motionState == this.motionTrajectory.Forward){
			this.motionTime = this.elapsedTime - this.motionTimeStart;
			this.motionVelocity = (this.maxVelocity * (Math.exp(2* Math.sqrt(this.acceleration*this.friction) * this.motionTime)- 1))/(Math.exp(2* Math.sqrt(this.acceleration*this.friction) * this.motionTime) + 1);
		 
			//Pitch
			if(this.pitchAngle < 20)
			{
				this.pitchAngle = this.pitchAngle + this.pitchAngleStep;
			}
			
			if(this.motionTime > this.maxTime){
				this.motionState = this.motionTrajectory.Halting;
			}
		} else if(this.motionState == this.motionTrajectory.Backward){
			this.motionTime = this.elapsedTime - this.motionTimeStart;
			this.motionVelocity = (this.maxVelocity * (Math.exp(2* Math.sqrt(this.acceleration*this.friction) * this.motionTime)- 1))/(Math.exp(2* Math.sqrt(this.acceleration*this.friction) * this.motionTime) + 1);
			this.motionVelocity *= -1;
			
			//Pitch
			if(this.pitchAngle > -20)
			{
				this.pitchAngle = this.pitchAngle - this.pitchAngleStep;
			}
			
			if(this.motionTime > this.maxTime){
				this.motionState = this.motionTrajectory.Halting;
			}
		} else if(this.motionState == this.motionTrajectory.Halting){
			this.motionTime = this.elapsedTime - this.motionTimeStart;
			if(Math.abs(this.motionVelocity) < 0.01){
				this.drone.setHelicesRotationSpeed(this.rotationSpeed.normal, this.rotationSpeed.normal, this.rotationSpeed.normal, this.rotationSpeed.normal)
				this.motionState = this.motionTrajectory.Stopped;
			}
			this.motionVelocity *= 0.95;
			
			//Pitch
			if(Math.abs(this.pitchAngle) != 0)
			{
				this.pitchCounterAngleStep = Math.abs(this.pitchAngle / 10);
				this.pitchAngle = this.pitchAngle - (sign(this.pitchAngle) * this.pitchCounterAngleStep);	
			}
			
		} else{
			this.motionVelocity = 0;
		}


		if(this.floatState == this.floatTrajectory.Upward){
			this.floatTime = this.elapsedTime - this.floatTimeStart;
			this.floatVelocity = (this.maxVelocity * (Math.exp(2* this.acceleration*this.friction * this.floatTime)- 1))/(Math.exp(2* this.acceleration*this.friction * this.floatTime) + 1);
			if(this.floatTime > this.maxTime){
				this.floatState = this.floatTrajectory.Halting;
			}
		} else if(this.floatState == this.floatTrajectory.Downward){
			if(this.floatTime > this.maxTime){
				this.floatState = this.floatTrajectory.Halting;
			}
			this.floatTime = this.elapsedTime - this.floatTimeStart;
			this.floatVelocity = (this.maxVelocity * (Math.exp(2* this.acceleration*this.friction * this.floatTime)- 1))/(Math.exp(2* this.acceleration*this.friction * this.floatTime) + 1);
			this.floatVelocity *= -1;
		} else if(this.floatState == this.floatTrajectory.Halting){
			if(Math.abs(this.floatVelocity) < 0.01)
				this.floatState = this.floatTrajectory.Stopped;
			this.floatVelocity *= 0.95;
		} else{
			this.floatVelocity = 0;
		}

		this.X += this.motionVelocity * Math.sin(this.angle*degToRad);
		this.Z += this.motionVelocity * Math.cos(this.angle*degToRad);
		this.Y += this.floatVelocity;
 		this.drone.hook.updateCoordinates(this.X, this.Y, this.Z);
	}
 }

 MyDroneHandler.prototype.updateTexturesIndex = function(bodyIndex, legIndex, heliceIndex){
 	this.drone.bodyTextureIndex = bodyIndex;
 	this.drone.legTextureIndex = legIndex;
 	this.drone.heliceTextureIndex = heliceIndex;
 }

 MyDroneHandler.prototype.checkCargoLoad = function(SceneCargo){
	var cargoSurface = SceneCargo.Y + 0.5;
 	if(cargoSurface < this.drone.hook.y && this.drone.hook.y < (cargoSurface + 0.2)
 		|| cargoSurface > this.drone.hook.y && this.drone.hook.y > (cargoSurface - 0.2)){
 		
 		var circle = {x:this.drone.hook.x, z:this.drone.hook.z, radius:this.drone.hook.radius * 2};
 		var rectangle = {x:SceneCargo.X, z:SceneCargo.Z, length:0.5};
		var collision = RectCircleColliding(circle, rectangle);
		if(collision){
			this.packageState = this.delivery.Delivering;
			SceneCargo.Y = this.drone.hook.y - 0.5;
		}
 	}
 }
 
 MyDroneHandler.prototype.checkCargoDrop = function(SceneCargo, LoadingZone){
	var cargoBottomSurface = SceneCargo.Y - 0.5;
	var loadingZoneSurface = 1;
	
 	if(cargoBottomSurface < loadingZoneSurface && loadingZoneSurface < (cargoBottomSurface + 0.2)
 		|| cargoBottomSurface > loadingZoneSurface && loadingZoneSurface > (cargoBottomSurface - 0.2)){
 		
 		var circle = {x: LoadingZone.X, z: LoadingZone.Z, radius: 0.8};
 		var rectangle = {x:SceneCargo.X/2, z:SceneCargo.Z/2, length:1};
		var collision = RectCircleColliding(circle, rectangle);
		if(collision){
			this.packageState = this.delivery.Delivered;
			SceneCargo.Y = 1.5;
		}
 	}
 }


function RectCircleColliding(circle, rectangle){
	//distances between the circle’s center and the rectangle’s center
	var halfRectangleLength = rectangle.length/2;
    var distX = Math.abs(circle.x - rectangle.x-halfRectangleLength);
    var distZ = Math.abs(circle.z - rectangle.z-halfRectangleLength);

	//If the distance is greater than halfCircle + halfRect means that they are too far apart to be colliding
    if (distX > (halfRectangleLength + circle.radius))
    	return false; 
    if (distZ > (halfRectangleLength + circle.radius))
    	return false;
 
	//If the distance is less than halfRect then they are definitely colliding
    if (distX <= halfRectangleLength && distZ <= halfRectangleLength)
    	return true;
	
	if (distX <= circle.radius && distZ <= circle.radius)
    	return true;

    return false;
}

function sign(x){
    if( +x === x ) { // check if a number was given
        return (x === 0) ? x : (x > 0) ? 1 : -1;
    }
    return NaN;
}

MyDroneHandler.prototype.getHook = function(){
	return this.drone.hook;
}