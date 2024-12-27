import { GameObj, Vec2 } from "kaplay";
import context from "../context";
import { NPCAnimation } from "../enums";

class NPC {
  sprite: GameObj;

  constructor(idx: number, animation: `${NPCAnimation}`, pos: Vec2) {
    this.sprite = context.make([
      context.sprite(`npc_${idx}`, { anim: animation }),
      context.pos(pos.x, pos.y),
      "npc",
    ]);
  }
}

export default NPC;
