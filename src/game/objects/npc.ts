import { Vec2 } from "kaplay";

import context from "../context";
import { NPCAnimation } from "../enums";

class NPC {
  static create(idx: number, animation: `${NPCAnimation}`, pos: Vec2) {
    return context.make([
      context.sprite(`npc_${idx}`, { anim: animation }),
      context.pos(pos.x, pos.y),
      "npc",
    ]);
  }
}

export default NPC;
