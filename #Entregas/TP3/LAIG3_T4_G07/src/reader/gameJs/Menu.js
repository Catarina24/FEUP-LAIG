/**
 * Menu.js
 * @constructor
 */

var submenu={
    MAIN:1,
    MODE:2,
    LEVEL:3,
    ABOUT:4,
    GAMEOVER:5,
};

var mode={
    HUMAN_VS_HUMAN: 1,
    HUMAN_VS_BOT:2,
    BOT_VS_BOT:3,
};

var level={
    EASY:1,
    NORMAL:2,
};

var optionsGameOver={
    PLAY_AGAIN:1,
    MENU:2,
};

function Menu(scene){
    this.scene = scene;

    this.optionSelected = -1;

    this.numOptions = 9;

    this.menuSelected = submenu.MAIN;

    this.positionX = 5;

    // Options attributes
    this.dimension=0.5;
    var parts = 10;

    // Option buttons
    this.backButton = new MyCube(scene, 3, parts, parts); 
    this.firstButton = new MyCube(scene, 3, parts, parts);
    this.secondButton = new MyCube(scene, 3, parts, parts);
    this.thirdButton = new MyCube(scene, 3, parts, parts);


    //Materials
    //this.titleAppearance = new CGFappearance(scene);
    //this.titleAppearance.loadTexture("resources\\images\\menus\\blockade.png");
    //this.setAllColors(this.titleAppearance, 1, 1, 1, 1);

    // Menu Materials
    this.menuMaterialWhite = new CGFappearance(this.scene);
    this.menuMaterialWhite.setAmbient(1, 0.9, 1, 1);
    this.menuMaterialWhite.setDiffuse(1, 0.9, 1, 1);
    this.menuMaterialWhite.setSpecular(1, 0.9, 1, 1);
    this.menuMaterialWhite.setShininess(1);

    // Menu textures aka texts
    this.textureMenuPlay = new CGFtexture(this.scene, "scenes/resources/menu_play.png");
    this.textureMenuAbout = new CGFtexture(this.scene, "scenes/resources/menu_about.png");
    this.textureMenuSoundOnOff = new CGFtexture(this.scene, "scenes/resources/menu_sound-on-off.png");

    this.textureAbout = new CGFtexture(this.scene, "scenes/resources/yavalath_about.png");

    this.textureMenuHumanVsHuman= new CGFtexture(this.scene, "scenes/resources/menu_human-vs-human.png");
    this.textureMenuHumanVsBot = new CGFtexture(this.scene, "scenes/resources/menu_human-vs-bot.png");
    this.textureMenuBotVsBot = new CGFtexture(this.scene, "scenes/resources/menu_bot-vs-bot.png");

    this.textureMenuEasy = new CGFtexture(this.scene, "scenes/resources/menu_easy.png");
    this.textureMenuNormal = new CGFtexture(this.scene, "scenes/resources/menu_normal.png");

    this.textureMenuBack = new CGFtexture(this.scene, "scenes/resources/menu_back.png");

    // Cell materials
    this.defaultCellAppearance = new CGFappearance(this.scene);
    this.defaultCellAppearance.setAmbient(1, 0.9, 0, 1);
    this.defaultCellAppearance.setDiffuse(1, 0.9, 0, 1);
    this.defaultCellAppearance.setSpecular(1, 0.9, 0, 1);
    this.defaultCellAppearance.setShininess(1);

    this.selectedCellAppearance = new CGFappearance(this.scene);
    this.selectedCellAppearance.setAmbient(0.8, 0, 0, 1);
    this.selectedCellAppearance.setDiffuse(0.8, 0, 0, 1);
    this.selectedCellAppearance.setSpecular(0.8, 0, 0, 1);
    this.selectedCellAppearance.setShininess(1);
    


}

Menu.prototype.constructor = Menu;

Menu.prototype.display = function(){
    
    this.scene.pushMatrix();

    this.pickListener();

    switch(this.menuSelected){
        case submenu.MAIN:
            this.displayMainMenu();
            break;

        case submenu.MODE:
            this.displayModeMenu();
            break;

        case submenu.LEVEL:
            this.displayLevelMenu();
            break;

        case submenu.ABOUT:
            this.displayAboutGame();
            break;
    }

    this.scene.popMatrix();
}

Menu.prototype.displayMainMenu = function(){

            // Play
            this.scene.pushMatrix();

                this.menuMaterialWhite.setTexture(this.textureMenuPlay);
                this.menuMaterialWhite.apply();

                this.scene.registerForPick(81, this.firstButton);
                this.scene.translate(this.positionX, 0.3, 2);
                this.scene.scale(1, 0.1, 0.3);
                this.firstButton.display();

            this.scene.popMatrix();

            // About
            this.scene.pushMatrix();

                this.menuMaterialWhite.setTexture(this.textureMenuAbout);
                this.menuMaterialWhite.apply();

                this.scene.registerForPick(82, this.secondButton);
                this.scene.translate(this.positionX, 0.3, 4);
                this.scene.scale(1, 0.1, 0.3);
                this.secondButton.display();

            this.scene.popMatrix();

            // Sound On/Off
            this.scene.pushMatrix();

                this.menuMaterialWhite.setTexture(this.textureMenuSoundOnOff);
                this.menuMaterialWhite.apply();
                
                this.scene.registerForPick(83, this.thirdButton);
                this.scene.translate(this.positionX, 0.3, 6);
                this.scene.scale(1, 0.1, 0.3);
                this.thirdButton.display();

            this.scene.popMatrix();

            this.scene.clearPickRegistration();
}


Menu.prototype.displayModeMenu = function(){

            // HUMAN_VS_HUMAN
            this.scene.pushMatrix();

                this.menuMaterialWhite.setTexture(this.textureMenuHumanVsHuman);
                this.menuMaterialWhite.apply();
                
                this.scene.registerForPick(84, this.firstButton);
                this.scene.translate(this.positionX, 0.3, 2);
                this.scene.scale(1, 0.1, 0.3);
                this.firstButton.display();

            this.scene.popMatrix();

            //HUMAN_VS_BOT
            this.scene.pushMatrix();

                this.menuMaterialWhite.setTexture(this.textureMenuHumanVsBot);
                this.menuMaterialWhite.apply();
                
                this.scene.registerForPick(85, this.secondButton);
                this.scene.translate(this.positionX, 0.3, 4);
                this.scene.scale(1, 0.1, 0.3);
                this.secondButton.display();

            this.scene.popMatrix();

            //BOT_VS_BOT
            this.scene.pushMatrix();

                this.menuMaterialWhite.setTexture(this.textureMenuBotVsBot);
                this.menuMaterialWhite.apply();
                
                this.scene.registerForPick(86, this.thirdButton);
                this.scene.translate(this.positionX, 0.3, 6);
                this.scene.scale(1, 0.1, 0.3);
                this.thirdButton.display();

            this.scene.popMatrix();

            //Back 
            this.scene.pushMatrix();

                this.menuMaterialWhite.setTexture(this.textureMenuBack);
                this.menuMaterialWhite.apply();
                
                this.scene.registerForPick(87, this.backButton);
                this.scene.translate(this.positionX, 0.2, 8);
                this.scene.scale(1, 0.1, 0.3);
                this.backButton.display();

            this.scene.popMatrix();

            this.scene.clearPickRegistration();
}

Menu.prototype.displayLevelMenu = function(){

            // EASY
            this.scene.pushMatrix();

                this.menuMaterialWhite.setTexture(this.textureMenuEasy);
                this.menuMaterialWhite.apply();
                
                this.scene.registerForPick(88, this.firstButton);
                this.scene.translate(this.positionX, 0.3, 2);
                this.scene.scale(1, 0.1, 0.3);
                this.firstButton.display();

            this.scene.popMatrix();

            //NORMAL
            this.scene.pushMatrix();

                this.menuMaterialWhite.setTexture(this.textureMenuNormal);
                this.menuMaterialWhite.apply();
                
                this.scene.registerForPick(89, this.secondButton);
                this.scene.translate(this.positionX, 0.3, 4);
                this.scene.scale(1, 0.1, 0.3);
                this.secondButton.display();

            this.scene.popMatrix();

             //Back 
            this.scene.pushMatrix();

                this.menuMaterialWhite.setTexture(this.textureMenuBack);
                this.menuMaterialWhite.apply();
                
                this.scene.registerForPick(90, this.backButton);
                this.scene.translate(this.positionX, 0.2, 6);
                this.scene.scale(1, 0.1, 0.3);
                this.backButton.display();

            this.scene.popMatrix();

            this.scene.clearPickRegistration();

}

Menu.prototype.displayAboutGame = function(){

            this.scene.pushMatrix();
            
                this.menuMaterialWhite.setTexture(this.textureAbout);
                this.menuMaterialWhite.apply();
                 
                this.scene.translate(this.positionX, 0.2, 2);
                this.scene.scale(1.2, 0.1, 1);
                this.backButton.display();

            this.scene.popMatrix();

            //Back 
            this.scene.pushMatrix();
            
                this.menuMaterialWhite.setTexture(this.textureMenuBack);
                this.menuMaterialWhite.apply();
                 
                this.scene.registerForPick(91, this.backButton);
                this.scene.translate(this.positionX, 0.2, 6);
                this.scene.scale(1, 0.1, 0.3);
                this.backButton.display();

            this.scene.popMatrix();

            this.scene.clearPickRegistration();

}



Menu.prototype.pickListener = function(){

    if (this.scene.pickMode == false) {
		if (this.scene.pickResults != null && this.scene.pickResults.length > 0) {
			for (var i=0; i< this.scene.pickResults.length; i++) {
				var obj = this.scene.pickResults[i][0];
				if (obj)
				{
					var customId = this.scene.pickResults[i][1];
                    this.optionSelected = customId; 

				}
			}
			this.scene.pickResults.splice(0,this.scene.pickResults.length);
		}	
	}
}