/**
 * MyInterface
 * @constructor
 */


function MyInterface() {
    //call CGFinterface constructor
    CGFinterface.call(this);
};

MyInterface.prototype = Object.create(CGFinterface.prototype);
MyInterface.prototype.constructor = MyInterface;


MyInterface.prototype.init = function(application) {

    CGFinterface.prototype.init.call(this, application);

    this.gui = new dat.GUI();
    this.omni = this.gui.addFolder("Omni Lights");
    this.omni.open();
    this.spot = this.gui.addFolder("Spot Lights");
    this.spot.open();

    return true;
};

MyInterface.prototype.addLight = function(type, i, name) {
    if (type == "omni")
        this.omni.add(this.scene.lightsStatus, i, this.scene.lightsStatus[i]).name(name);
    else
        this.spot.add(this.scene.lightsStatus, i, this.scene.lightsStatus[i]).name(name);

}


MyInterface.prototype.processKeyDown = function(event) {


    switch (event.keyCode) {
        case (86):
        case (118): //V
            this.scene.updateView();
            break;
        case (77):
        case (109): //M
            this.scene.updateMaterial();
            break;
    };
};
