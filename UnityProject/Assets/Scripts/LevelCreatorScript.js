#pragma strict

var level_tiles : GameObject[];
var shadowed_lights : Array;

function SpawnTile(where:int, challenge:float , player:boolean){
	var level_obj = level_tiles[Random.Range(0,level_tiles.Length)];
	var level = new GameObject(level_obj.name + " (Clone)");
	for (var child : Transform in level_obj.transform){
		if(child.gameObject.name != "enemies" && child.gameObject.name != "player_spawn"){
			var child_obj = Instantiate(child.gameObject, Vector3(0,0,where*20) + child.localPosition, child.localRotation);
			child_obj.transform.parent = level.transform;
		}
	}
	var enemies = level_obj.transform.FindChild("enemies");
	if(enemies){
		for(var child : Transform in enemies){
			if(Random.Range(0.0,1.0) <= challenge){
				child_obj = Instantiate(child.gameObject, Vector3(0,0,where*20) + child.localPosition + enemies.localPosition, child.localRotation);
				child_obj.transform.parent = level.transform;
			}
		}
	}
	if(player){
		var players = level_obj.transform.FindChild("player_spawn");
		if(players){
			var num = 0;
			for(var child : Transform in players){
				++num;
			}
			var save = Random.Range(0,num);
			var j=0;
			for(var child : Transform in players){
				if(j == save){
					child_obj = Instantiate(child.gameObject, Vector3(0,0,where*20) + child.localPosition + players.localPosition, child.localRotation);
					child_obj.transform.parent = level.transform;
					child_obj.name = "Player";
				}
				++j;
			}
		}
	}
	level.transform.parent = this.gameObject.transform;
	
	var lights = GetComponentsInChildren(Light);
	for(var light : Light in lights){
		if(light.enabled && light.shadows == LightShadows.Hard){
			shadowed_lights.push(light);
		}
	}
}

function Start () {
	shadowed_lights = new Array();
	SpawnTile(0,0.0,true);
}

function Update () {
	for(var light : Light in shadowed_lights){
		if(light){
			var shadowed_amount = Vector3.Distance(GameObject.Find("Main Camera").transform.position, light.gameObject.transform.position);
			var shadow_threshold = Mathf.Min(20,light.range*2.0);
			var fade_threshold = shadow_threshold * 0.75;
			if(shadowed_amount < shadow_threshold){
				light.shadows = LightShadows.Hard;
				light.shadowStrength = Mathf.Min(1.0, 1.0-(fade_threshold - shadowed_amount) / (fade_threshold - shadow_threshold));
			} else {
				light.shadows = LightShadows.None;
			}
		}
	}
}