/**
 * MyChessboard
 * @constructor
 */

function MyChessboard(scene, du, dv, su, sv, texture, color1, color2, colorselected, material){

    CGFobject.call(this,scene);

    this.scene = scene;
    this.du = du;
    this.dv = dv;
    this.su = su;
    this.sv = sv;
    this.texture = texture;
    this.color1 = color1;
    this.color2 = color2;
    this.colorselected = colorselected;

    this.chessboard = new MyPlane(scene, 1, 1, du, dv);

    //TEXTURE
    this.texture = new CGFtexture(scene, texture);

    //MATERIAL
    this.appearance = material;
    this.appearance.loadTexture(texture);
    //this.appearance.setTextureWrap('REPEAT', 'REPEAT');

    //SHADER
    this.shader = new CGFshader(this.scene.gl, "shaders/shader.vert", "shaders/shader.frag");
    this.shader.setUniformsValues({ uSampler: 1, 
                                    du: parseInt(this.du)*1.0, 
                                    dv: parseInt(this.dv)*1.0, 
                                    su: parseInt(this.su)*1.0,
                                    sv: parseInt(this.sv)*1.0, 
                                    c1:color1, c2:color2, cs: colorselected});

    //this.initBuffers();
}

MyChessboard.prototype = Object.create(CGFobject.prototype);
MyChessboard.prototype.constructor = MyChessboard;

MyChessboard.prototype.display = function(){    

        this.appearance.apply();

      
        this.scene.setActiveShader(this.shader);


        
        this.chessboard.display();

        //this.texture.unbind(0);
        this.scene.setActiveShader(this.scene.defaultShader);
        this.scene.materialDefault.apply();
};