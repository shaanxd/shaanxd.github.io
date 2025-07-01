import {
  Animal,
  AnimalAnimation,
  Character,
  DoorAnimation,
  NPCAnimation,
  PlayerAnimation,
  PortraitAnimation,
  Scene,
  VehicleAnimation,
} from "./enums";
import context from "./context";

import apartment from "./scenes/apartment";
import { getSpriteParamsWithOffset, getSpritesheetParams } from "./utils/tiles";
import balcony from "./scenes/balcony";
import { NPCAnimationMap } from "./constants";
import bayes from "./scenes/bayes";

const init = () => {
  context.loadSprite("apartment", "./backgrounds/apartment.png");
  context.loadSprite("balcony-bg", "./backgrounds/balcony-bg.png");
  context.loadSprite("balcony-fg", "./backgrounds/balcony-fg.png");
  context.loadSprite("third", "./backgrounds/third.png");
  context.loadSprite("fourth", "./backgrounds/fourth.png");

  [
    Character.Shahid,
    Character.Hafsah,
    `${Character.Shahid}-1`,
    `${Character.Shahid}-2`,
    `${Character.Shahid}-3`,
    `${Character.Shahid}-4`,
    `${Character.Shahid}-5`,
  ]
    .map((name) => name.toLowerCase())
    .forEach((name) => {
      context.loadSprite(
        name,
        `/characters/${name}.png`,
        getSpriteParamsWithOffset(
          56,
          20,
          [
            { name: PlayerAnimation.IdleUp, values: [118, 123] },
            { name: PlayerAnimation.IdleDown, values: [130, 135] },
            { name: PlayerAnimation.IdleSide, values: [112, 117] },
            { name: PlayerAnimation.WalkUp, values: [230, 235] },
            { name: PlayerAnimation.WalkDown, values: [242, 247] },
            { name: PlayerAnimation.WalkSide, values: [224, 229] },
            { name: PlayerAnimation.Read, values: [784, 795] },
            { name: PlayerAnimation.CheckPhone, values: [675, 680] },
          ],
          { speed: 10, loop: true }
        )
      );
      if (!name.includes("-")) {
        context.loadSprite(
          `${name}-portrait`,
          `/characters/${name}-portrait.png`,
          getSpriteParamsWithOffset(
            10,
            3,
            [
              { name: PortraitAnimation.Idle, values: [0, 8] },
              { name: PortraitAnimation.Agree, values: [9, 17] },
              { name: PortraitAnimation.Disagree, values: [18, 26] },
            ],
            {
              speed: 10,
            }
          )
        );
      }
    });

  context.loadSprite("doors", "/objects/doors.png", {
    ...getSpritesheetParams(
      5,
      1,
      [
        { name: DoorAnimation.Open, values: [0, 4] },
        { name: DoorAnimation.Closed, values: [4, 0] },
      ],
      { speed: 10 }
    ),
  });

  context.loadSprite("elevator_doors", "/objects/elevator_door.png", {
    ...getSpritesheetParams(
      8,
      1,
      [
        { name: DoorAnimation.Open, values: [0, 7] },
        { name: DoorAnimation.Closed, values: [7, 0] },
      ],
      { speed: 10 }
    ),
  });

  Array(4)
    .fill("")
    .forEach((_, index) => {
      const name = `npc_${index + 1}`;
      context.loadSprite(
        name,
        `./characters/${name}.png`,
        getSpriteParamsWithOffset(
          42,
          1,
          Object.values(NPCAnimation).map((key) => ({
            name: key,
            values: NPCAnimationMap[key],
          })),
          { speed: 10, loop: true }
        )
      );
    });

  Array(5)
    .fill("")
    .forEach((_, index) => {
      const name = `vehicle_${index + 1}`;
      context.loadSprite(
        name,
        `./objects/${name}.png`,
        getSpriteParamsWithOffset(
          6,
          1,
          Object.values(VehicleAnimation).map((key) => ({
            name: key,
            values: [0, 4],
          })),
          { speed: 10, loop: true }
        )
      );
    });

  context.loadSprite(Animal.Cat, "./characters/cat.png", {
    ...getSpritesheetParams(
      12,
      1,
      [
        {
          name: AnimalAnimation.Idle,
          values: [0, 11],
        },
      ],
      { loop: true }
    ),
  });
  context.loadSprite("dialog-box", "./ui/dialog-box.png", {
    sliceX: 3,
    sliceY: 1,
  });
  context.loadSprite("settings", "./ui/settings.png", {
    sliceX: 1,
    sliceY: 1,
  });
  context.loadSprite("info", "./ui/info.png", {
    sliceX: 1,
    sliceY: 1,
  });
  context.loadSprite("flags", "./ui/flags.png", {
    sliceX: 5,
    sliceY: 1,
  });
  context.loadSprite("toggles", "./ui/toggles.png", {
    sliceX: 1,
    sliceY: 2,
  });

  context.loadSprite("icons", "./ui/icons.png", {
    sliceX: 4,
    sliceY: 1,
  });
  context.loadSprite("dialog-box-portrait", "./ui/dialog-box-portrait.png", {
    sliceX: 1,
    sliceY: 1,
  });
  context.loadSprite("dialog-box-name-tag", "./ui/dialog-box-name-tag.png", {
    sliceX: 1,
    sliceY: 1,
  });
  context.loadSprite("buttons", "./ui/buttons.png", {
    sliceX: 4,
    sliceY: 1,
  });

  context.loadSprite("socials", "./ui/socials.png", {
    sliceX: 4,
    sliceY: 1,
  });

  context.setBackground(context.Color.fromHex("#311047"));

  context.loadFont("medodica", "fonts/medodica.otf");
  context.loadMusic("bgm", "./sounds/bgm.mp3");

  context.scene(Scene.Apartment, apartment);
  context.scene(Scene.Balcony, balcony);
  context.scene(Scene.Third, bayes(Scene.Third));
  context.scene(Scene.Fourth, bayes(Scene.Fourth));

  context.go(Scene.Apartment);

  window.addEventListener("resize", () => {
    location.reload();
  });
};

export default init;
