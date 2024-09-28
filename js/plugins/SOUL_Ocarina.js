// SOUL_Ocarina.js by Soulpour777

/*:
* @plugindesc v1.0 Creates a Ocarina-esque type of system to do something with an ocarina.
* @author Soulpour777 - soulxregalia.wordpress.com
*
* @param -- MAX NOTES --
* 
* @param Max Number of Notes
* @desc The maximum number of keys that the ocarina can accept before judging if it is a right piece or not.
* @default 10
*
* @param -- KEY SOUND --
* 
* @param Key Up (Key of A)
* @desc The sound effect played when the UP key is pressed.
* @default Ocarina-Key-Up
*
* @param Key Down (Key of B)
* @desc The sound effect played when the DOWN key is pressed.
* @default Ocarina-Key-Down
*
* @param Key Left (Key of C)
* @desc The sound effect played when the LEFT key is pressed.
* @default Ocarina-Key-Left
*
* @param Key Right (Key of D)
* @desc The sound effect played when the RIGHT key is pressed.
* @default Ocarina-Key-Right
*
* @param Key Shift (Key of E)
* @desc The sound effect played when the SHIFT key is pressed.
* @default Ocarina-Key-A
*
* @param -- SE --
* 
* @param Note Confirmed
* @desc The sound effect played when the musical piece is confirmed.
* @default Ocarina-SongisCorrect
*
* @param Ocarina Cancelled
* @desc The sound effect played when the ocarina is cancelled or the song is not confirmed.
* @default Buzzer2
*
* @param -- OCARINA IMAGE --
* 
* @param Ocarina Image
* @desc The image shown when the ocarina is on PLAY.
* @default Link Ocarina
*
* @param -- KEY IMAGE --
* 
* @param Key Image Margin X
* @desc The horizontal margin (x coord) of the key images when they are shown on screen.
* @default 75
* 
* @param Key Image Margin Y
* @desc The vertical margin (y coord) of the key images when they are shown on screen.
* @default 450
*

@help

Place all images under img / soul_ocarina folder. If the folder is not existent,
please do create one.

For the Key Images, they are named after what key they are. A is A, B is B
and so on.

====================
Max Number of Notes
====================

This one is the max counter before the ocarina stops accepting more notes.
This means that even if the number of notes for one piece is 7 and your
counter is 10, it would execute the piece right away and clears
the counter. So, if you input more than the max number of notes, it
won't accept it anymore and just transfers you to the map.

=================================
HOW TO ADD YOUR OWN MUSICAL PIECE
=================================

To add your own musical piece, do this on a script call:
$gameSystem.createSongPiece(key, commonEvent);

where:
    key is the list of keys. Enclosed in a [],
    separated in commas.
    commonEvent is the common event ID executed
    when the ocarina plays this pattern.

example:
$gameSystem.createSongPiece(['D', 'E', 'B', 'D', 'E', 'B'], 6);

^ when you play the ocarina and you successfully made
DEBDEB, common event 6 would be executed.    

*/
var xocarina = PluginManager.parameters('SOUL_Ocarina');

var Imported = Imported || {};
Imported.SOUL_Ocarina = true;

var Soulpour777 = Soulpour777 || {};
Soulpour777.OcarinaX = Soulpour777.OcarinaX || {};

Soulpour777.OcarinaX.keyOfA_UP = String(xocarina['Key Up (Key of A)']);
Soulpour777.OcarinaX.keyOfB_DOWN = String(xocarina['Key Down (Key of B)']);
Soulpour777.OcarinaX.keyOfC_LEFT = String(xocarina['Key Left (Key of C)']);
Soulpour777.OcarinaX.keyOfD_RIGHT = String(xocarina['Key Right (Key of D)']);
Soulpour777.OcarinaX.keyOfE_SHIFT = String(xocarina['Key Shift (Key of E)']);
Soulpour777.OcarinaX.noteConfirmed = String(xocarina['Note Confirmed']);
Soulpour777.OcarinaX.buzzer = String(xocarina['Ocarina Cancelled']);
Soulpour777.OcarinaX.ocarinaLink = String(xocarina['Ocarina Image']);

Soulpour777.OcarinaX.marginX = Number(xocarina['Key Image Margin X']);
Soulpour777.OcarinaX.marginY = Number(xocarina['Key Image Margin Y']);

Soulpour777.OcarinaX.maxCounter = Number(xocarina['Max Number of Notes']);

function arraysEqual(arr1, arr2) {
    if(arr1.length !== arr2.length)
        return false;
    for(var i = arr1.length; i--;) {
        if(arr1[i] !== arr2[i])
            return false;
    }

    return true;
}

ImageManager.loadOcarina = function(filename, hue) {
    return this.loadBitmap('img/soul_ocarina/', filename, hue, true);
};


var buzzer = {
    name: Soulpour777.OcarinaX.buzzer,
    volume: 100,
    pitch: 100,
    pan: 0
}

var ocarinaKeyDown = {
	name: Soulpour777.OcarinaX.keyOfB_DOWN,
	volume: 100,
	pitch: 100,
	pan: 0
}

var ocarinaKeyRight = {
	name: Soulpour777.OcarinaX.keyOfD_RIGHT,
	volume: 100,
	pitch: 100,
	pan: 0
}

var ocarinaKeyLeft = {
	name: Soulpour777.OcarinaX.keyOfC_LEFT,
	volume: 100,
	pitch: 100,
	pan: 0
}

var ocarinaKeyUp = {
	name: Soulpour777.OcarinaX.keyOfA_UP,
	volume: 100,
	pitch: 100,
	pan: 0
}

var ocarinaKeyA = {
    name: Soulpour777.OcarinaX.keyOfE_SHIFT,
    volume: 100,
    pitch: 100,
    pan: 0
}


var ocarinaCorrect = {
    name: Soulpour777.OcarinaX.noteConfirmed,
    volume: 100,
    pitch: 100,
    pan: 0
}


    Soulpour777.OcarinaX.Game_System_initialize = Game_System.prototype.initialize;
    Game_System.prototype.initialize = function() {
        Soulpour777.OcarinaX.Game_System_initialize.call(this);
        this._ocarinaKeys = [];
        this._allSongPieceCommonEvent = [];
        this._allSongPieces = [];
    }

    Game_System.prototype.createSongPiece = function(key, commonEvent) {
        this._allSongPieces.push(key);
        this._allSongPieceCommonEvent.push(commonEvent);
    }

    function Scene_Ocarina() {
        this.initialize.apply(this, arguments);
    }

    Scene_Ocarina.prototype = Object.create(Scene_Base.prototype);
    Scene_Ocarina.prototype.constructor = Scene_Ocarina;

    Scene_Ocarina.prototype.initialize = function() {
        Scene_Base.prototype.initialize.call(this);
        this.ocarinaKeysImage = [];
    };

    Scene_Ocarina.prototype.create = function() {
        Scene_Base.prototype.create.call(this);
        BattleManager.saveBgmAndBgs();
        this.fadeOutAll();
        this.createBackground();
        this.createLinkPlayingOcarina();
    };

    Scene_Ocarina.prototype.createLinkPlayingOcarina = function() {
        this.linkOcarina = new Sprite();
        this.linkOcarina.bitmap = ImageManager.loadOcarina(Soulpour777.OcarinaX.ocarinaLink);
        this.addChild(this.linkOcarina);
    }

    Scene_Ocarina.prototype.start = function() {
        Scene_Base.prototype.start.call(this);
        this.startFadeIn(this.slowFadeSpeed(), false);
    };

    Scene_Ocarina.prototype.update = function() {
        if (this.isActive() && !this.isBusy() && this.confirmTrigger()) {
            if($gameSystem._ocarinaKeys.length <= 0) {
                AudioManager.playSe(buzzer);
                $gameSystem._ocarinaKeys = [];
                SceneManager.push(Scene_Map);
            }
            this.checkPieceFinal();
        } 

        if (this.isActive() && !this.isBusy() && this.cancelTrigger()) {
            $gameSystem._ocarinaKeys = [];
            SceneManager.push(Scene_Map);
        }

        Scene_Base.prototype.update.call(this);

        if (Input.isTriggered('down')) {
            $gameSystem._ocarinaKeys.push('B');
            this.setKeyImage('B');
            AudioManager.playSe(ocarinaKeyDown);
            this.checkPiece();
        }
        if (Input.isTriggered('right')) {
            $gameSystem._ocarinaKeys.push('D');
            this.setKeyImage('D');
            AudioManager.playSe(ocarinaKeyRight);
            this.checkPiece();
        }
        if (Input.isTriggered('left')) {
            $gameSystem._ocarinaKeys.push('C');
            this.setKeyImage('C');
            AudioManager.playSe(ocarinaKeyLeft);
            this.checkPiece();
        }        

        if (Input.isTriggered('up')) {
            $gameSystem._ocarinaKeys.push('A');
            this.setKeyImage('A');
            AudioManager.playSe(ocarinaKeyUp);
            this.checkPiece();
        } 

        if (Input.isTriggered('shift')) {
            $gameSystem._ocarinaKeys.push('E');
            this.setKeyImage('E');
            AudioManager.playSe(ocarinaKeyA);
            this.checkPiece();
        } 

        this.showCurrentKeys();

        if ($gameSystem._ocarinaKeys.length >= Soulpour777.OcarinaX.maxCounter) {
            $gameSystem._ocarinaKeys = [];
            SceneManager.push(Scene_Map);
        }
    };

    Scene_Ocarina.prototype.setKeyImage = function(sprite) {
        var spr = new Sprite();
        spr.bitmap = ImageManager.loadOcarina(sprite);
        this.ocarinaKeysImage.push(spr);
    }

    Scene_Ocarina.prototype.showCurrentKeys = function() {
        var xline = Soulpour777.OcarinaX.marginX;
        var yline = Soulpour777.OcarinaX.marginY;
        for (var i = 0; i < this.ocarinaKeysImage.length; i++) {
            this.ocarinaKeysImage[i].x = i * xline;
            this.ocarinaKeysImage[i].y = yline;
            this.addChild(this.ocarinaKeysImage[i]);
        }
    }

    Scene_Ocarina.prototype.checkPiece = function() {
        for (var i = 0; i < $gameSystem._allSongPieces.length; i++) {
            if(arraysEqual($gameSystem._ocarinaKeys, $gameSystem._allSongPieces[i])) {
                SceneManager.push(Scene_Map);
                $gameTemp.reserveCommonEvent($gameSystem._allSongPieceCommonEvent[i]);
                $gameSystem._ocarinaKeys = [];
                
            }
        }
    }

    Scene_Ocarina.prototype.checkPieceFinal = function() {
        for (var i = 0; i < $gameSystem._allSongPieces.length; i++) {
            if(arraysEqual($gameSystem._ocarinaKeys, $gameSystem._allSongPieces[i])) {
                SceneManager.push(Scene_Map);
                $gameTemp.reserveCommonEvent($gameSystem._allSongPieceCommonEvent[i]);
                $gameSystem._ocarinaKeys = [];
                
            } else {
                $gameSystem._ocarinaKeys = [];
                AudioManager.playSe(buzzer);
                SceneManager.push(Scene_Map);
                BattleManager.replayBgmAndBgs();
            }
        }
    }

    Scene_Ocarina.prototype.stop = function() {
        Scene_Base.prototype.stop.call(this);
        this.fadeOutAll();
    };

    Scene_Ocarina.prototype.terminate = function() {
        Scene_Base.prototype.terminate.call(this);
        this.eraseKeyImage();
    };

    Scene_Ocarina.prototype.eraseKeyImage = function() {
        for (var i = 0; i < this.ocarinaKeysImage.length; i++) {
            this.removeChild(this.ocarinaKeysImage[i]);
        }    
    }

    Scene_Ocarina.prototype.createBackground = function() {
        this._backSprite = new Spriteset_Map();
        this.addChild(this._backSprite);
    };

    Scene_Ocarina.prototype.confirmTrigger = function() {
        return Input.isTriggered('ok') || TouchInput.isTriggered();
    };

    Scene_Ocarina.prototype.cancelTrigger = function() {
        return Input.isTriggered('cancel');
    }

    Soulpour777.OcarinaX.Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        // to be overridden by plugins
        Soulpour777.OcarinaX.Game_Interpreter_pluginCommand.call(this, command, args);
        if (command === 'SOUL') {
            if (args[0] === ':') {
                if (args[1] === 'Ocarina') {
                    if(args[2] === ':') {
                        if (args[3] === 'Start') {
                            SceneManager.push(Scene_Ocarina);
                        }
                    }
                }
            }
        }
    };    

