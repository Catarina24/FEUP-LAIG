/**
 * MyChessboard
 * @constructor
 */

function MyChessboard(scene, du, dv, su, sv, texture, color1, color2, colorselected){

    CGFobject.call(this,scene);

    this.du = du;
    this.dv = dv;
    this.su = su;
    this.sv = sv;
    this.texture = texture;
    this.color1 = color1;
    this.color2 = color2;
    this.colorselected = colorselected;

    this.chessboard = new MyPlane(scene, du, dv, du, dv);

    this.initBuffers();
}

MyChessboard.prototype = Object.create(CGFobject.prototype);
MyChessboard.prototype.constructor = MyChessboard;

MyChessboard.prototype.display = function(){

};