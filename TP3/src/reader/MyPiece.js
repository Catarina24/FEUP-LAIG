/**
 * MyPiece
 * @constructor
 */

/**
 * Constrcutor. 
 * @param color Is either 0 (black) or 1 (white). Default is white color.
 */
function MyPiece(scene, color, height, radius) {
 	this.scene = scene;
    this.color = color;

    this.boardCoord = new Coord2(-1, -1); // default coodinates on the board a.k.a. not placed

    this.object = new MyCylinder(this.scene, 20, 20, height, radius, radius);

    this.animate = false;

    // Appearances for the piece
    this.whiteAppearance = new CGFappearance(this.scene);
    this.whiteAppearance.setAmbient(1, 1, 1, 1);
    this.whiteAppearance.setDiffuse(1, 1, 1, 1);
    this.whiteAppearance.setSpecular(1, 1, 1, 1);
    this.whiteAppearance.setShininess(1);

    this.blackAppearance = new CGFappearance(this.scene);
    this.blackAppearance.setAmbient(0, 0, 0, 1);
    this.blackAppearance.setDiffuse(0, 0, 0, 1);
    this.blackAppearance.setSpecular(0, 0, 0, 1);
    this.blackAppearance.setShininess(1);

    // Positions needed for animation
    this.initialPositionMatrix = null;
    this.finalPositionMatrix = null;
    this.translationVector = null;
 };

 MyPiece.prototype = Object.create(CGFobject.prototype);
 MyPiece.prototype.constructor = MyPiece;

 MyPiece.prototype.display = function()
 {
     if(this.color == 0)
     {
         this.blackAppearance.apply();
     }
     else
     {
         this.whiteAppearance.apply();
     }

     this.object.display();
 }

 MyPiece.prototype.extractTranslationVector = function (){
     var vector = new Coord3(0, 0, 0);

     if(this.color == 0)
     {
         this.initialPositionMatrix = {3: 6, 7: 0, 11:0};
     }
     else
     {
         this.initialPositionMatrix = {3: -6, 7: 0, 11:0};
     }

     var x = this.finalPositionMatrix[12] - this.initialPositionMatrix[3];
     var y = this.finalPositionMatrix[13] - this.initialPositionMatrix[7];
     var z = this.finalPositionMatrix[14] - this.initialPositionMatrix[11];

     vector.set(x, y, z);

     this.translationVector = vector;
     debugger;
 }