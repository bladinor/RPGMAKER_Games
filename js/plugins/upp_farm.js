/*:
* @plugindesc UPP_Core plugin, place on top of other plugins.
* @author William Ramsey (TheUnproPro)
*/
(function (){
  if(typeof $upp === 'undefined' || !$upp) {
    var f = confirm("You don't seem to have a version of upp_core. Click Ok to download it now.");
    if(f == true) {
      var current=window;
  		var open=window.open("https://drive.google.com/file/d/0B0BQK1ikmkf4dFR6b2pXUzI1TzA/view?usp=sharing", "_blank");
  		open.focus();
    }
  }
  var farmCommands = Game_Interpreter.prototype.pluginCommand
  Game_Interpreter.prototype.pluginCommand = function(command, args) {
  	farmCommands.apply(this);
    if(command == "startCrop"){
      $upp.vars.farmData[args[0]] = {
        cropTimer: 0,
        cropCompletion: 0,
        cropComplete: false,
        cropEnd: Number(args[1])
      }
      console.log($upp.vars.farmData[args[0]].cropEnd);
    }
  }

  $upp.vars.farmData = [];
  $upp.checkCropStatus = function(id, value)
  {
    if( $upp.vars.farmData[id].cropCompletion == value )
    {
      return true;
    } else {
      return false;
    }
  }

  $upp.cropComplete = function(id)
  {
    if( $upp.vars.farmData[id].cropCompletion == $upp.vars.farmData[id].cropEnd )
    {
      return true;
    } else {
      return false;
    }
  }

  var mapUpdateAlias = Scene_Map.prototype.update
  Scene_Map.prototype.update = function(){
    mapUpdateAlias.call(this);
    var i = $upp.vars.farmData.length;
    while(i--){
      if($upp.vars.farmData[i]){
        if($upp.vars.farmData[i].cropComplete == false){
          $upp.vars.farmData[i].cropTimer += ($upp.vars.farmData[i].cropCompletion != $upp.vars.farmData[i].cropEnd) ? 1:0;
          $upp.vars.farmData[i].cropCompletion += ($upp.vars.farmData[i].cropTimer == 60) ? 1:0
          $upp.vars.farmData[i].cropTimer = ($upp.vars.farmData[i].cropTimer == 60) ? 0:$upp.vars.farmData[i].cropTimer;
          $upp.vars.farmData[i].cropComplete = ($upp.vars.farmData[i].cropCompletion == $upp.vars.farmData[i].cropEnd) ? true:false;
        }
      }
    }
  }
})();
