import { getUserData } from "@decentraland/Identity"
import * as crypto from '@dcl/crypto-scene-utils'
import * as layerTwo from '@dcl/l2-scene-utils'
import * as utils from '@dcl/ecs-scene-utils'
import { buy } from "./blockchain/index"


//Collections prefix
const urnPrefix : string = "urn:decentraland:matic:collections-v2:"
//Create buttonClicked varriable
let buttonClicked : number;
//Create default wear variable
const defaultWear : number;


//Closet  wearable closet array
const closet : string[][] =[
  //hats
   ["6","doggy daycare","0x6cc419f307d2bdb787dfb7633ec792002a72a4c1:0"], 
   ["6","highness crown","0x180fe56efea7128ab619a0134145e2c1f8ec010f:0"],
  //upper body
   ["6","highness crown","0x180fe56efea7128ab619a0134145e2c1f8ec010f:0"],
   ["6","highness crown","0x180fe56efea7128ab619a0134145e2c1f8ec010f:0"],
];



//Create avatar entity stand
const stand = new Entity();
stand.addComponent(new BoxShape());
stand.addComponent(new Transform({ position: new Vector3(8, 0, 8) }));
engine.addEntity(stand);

//Create avatar entity and assign AvatarShape component
const avatar = new Entity();
const avatarShape = new AvatarShape();

avatarShape.bodyShape = "urn:decentraland:off-chain:base-avatars:BaseMale";
avatarShape.wearables = [
  "urn:decentraland:off-chain:base-avatars:f_sweater",
  "urn:decentraland:off-chain:base-avatars:f_jeans",
  "urn:decentraland:off-chain:base-avatars:bun_shoes",
  "urn:decentraland:off-chain:base-avatars:standard_hair",
  "urn:decentraland:off-chain:base-avatars:f_eyes_00",
  "urn:decentraland:off-chain:base-avatars:f_eyebrows_00",
  "urn:decentraland:off-chain:base-avatars:f_mouth_00",
];
avatarShape.skinColor = new Color4(0.94921875, 0.76171875, 0.6484375, 1);
avatarShape.eyeColor = new Color4(0.23046875, 0.625, 0.3125, 1);
avatarShape.hairColor = new Color4(0.234375, 0.12890625, 0.04296875, 1);
avatar.addComponent(avatarShape);

let StartPos = new Vector3(1, 1, 1)
let EndPos = new Vector3(15, 1, 15)

//Set avatar position
avatar.addComponent(new Transform({ position: new Vector3(8, .5, 8) }));
//avatar.addComponent(new utils.MoveTransformComponent(StartPos, EndPos, 8));
engine.addEntity(avatar);

void getUserData().then(async a => {
  const res = await fetch(`https://peer.decentraland.org/lambdas/profiles/${a?.publicKey}`)
  const json = await res.json()
  const av = json.avatars[0].avatar
  //log(av)
  avatarShape.bodyShape = av.bodyShape;
  avatarShape.skinColor = new Color4(av.skin.color.r, av.skin.color.g, av.skin.color.b, 1);
  avatarShape.eyeColor = new Color4(av.eyes.color.r, av.eyes.color.g, av.eyes.color.b, 1);
  avatarShape.hairColor = new Color4(av.hair.color.r, av.hair.color.g, av.hair.color.b, 1);
  avatarShape.wearables = av.wearables;

  //
  defaultWear = avatarShape.wearables.length;
  log("Default Wear Length Saved: " + defaultWear);

  
})

//Create buttons

//Create refresh button
const selectionB0 = new Entity();
selectionB0.addComponent(new BoxShape());
selectionB0.addComponent(new Transform({ position: new Vector3(10,0,8)}));

selectionB0.addComponent(
  new OnPointerDown((e) => {
    log("Reset was clicked", e)
    buttonClicked = 0;
    button(buttonClicked);
  },)  
)
engine.addEntity(selectionB0);



//Create button 1
const selectionB1 = new Entity();
selectionB1.addComponent(new BoxShape());
selectionB1.addComponent(new Transform({ position: new Vector3(6,0,8)}));

selectionB1.addComponent(
  new OnPointerDown((e) => {
    log("selectionB1 was clicked", e)
    buttonClicked = 1;
    button(buttonClicked);
  },)  
)
engine.addEntity(selectionB1);

//Create button 2
const selectionB2 = new Entity();
selectionB2.addComponent(new BoxShape());
selectionB2.addComponent(new Transform({ position: new Vector3(4,0,8)}));

selectionB2.addComponent(
  new OnPointerDown((e) => {
    log("selectionB2 was clicked", e)
    buttonClicked = 2;
    button(buttonClicked);
  },)  
)
engine.addEntity(selectionB2);

// Button Function
function button(buttonClicked: number) {
  switch (buttonClicked){
    case 0:
        log('case 0 active');
          if (avatarShape.wearables.length > defaultWear) {
            avatarShape.wearables.splice(0,1);
            log("Avatar Model Reset!");
          }
          break;
    case 1:
        log('case 1 active');
        itemSwap(0);
        avatarShape.expressionTriggerId = 'tik'
        avatarShape.expressionTriggerTimestamp = Math.random() * 101001010
        break;
    case 2:
        log('case 2 active');
        itemSwap(1);
        avatarShape.expressionTriggerId = 'wave'
        avatarShape.expressionTriggerTimestamp = Math.random() * 101001010
        
        //Call buy function
        buy('0x30517529cb5c16f686c6d0b48faae5d250d43005','0','10000000000000000');

        break;0x30517529cb5c16f686c6d0b48faae5d250d43005
    case 3:
        log('case 3 active');
        itemSwap(2);
        log("default wear length: " + defaultWear);
        break;

  }
}


// Remove last item add new item
function itemSwap(closetItem: number){
  if (avatarShape.wearables.length > defaultWear) {
    log(avatarShape.wearables.length);
    avatarShape.wearables.splice(0,1);
    log(avatarShape.wearables.length);
    avatarShape.wearables.unshift(urnPrefix + closet[closetItem][2]);
  } else {
    log(avatarShape.wearables.length);
    avatarShape.wearables.unshift(urnPrefix + closet[closetItem][2]);
    log(avatarShape.wearables.length);
  }
  log("default wear length: " + defaultWear);
}

