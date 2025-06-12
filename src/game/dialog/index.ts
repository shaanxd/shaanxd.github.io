import { Interactable, Interaction } from "../enums";
import { Dialog, KeyValuePair } from "../types";
import { onPlayerChangeClothes, onResumeClick } from "./actions";

const dialog: KeyValuePair<Dialog[]> = {
  [Interactable.BalconyView]: [],
  [Interactable.ComputerTable]: [
    { line: "computerTable.1" },
    { line: "computerTable.2" },
    { line: "computerTable.3" },
    {
      line: "computerTable.4",
      options: [
        {
          type: "prompt.yes",
          onClick: onResumeClick,
        },
        {
          type: "prompt.no",
        },
      ],
    },
  ],
  [Interactable.KitchenCounter]: [],
  [Interactable.Luggage]: [{ line: "luggage.1" }],
  [Interactable.TVTable]: [{ line: "tvTable.1" }],
  [Interactable.Bed]: [{ line: "bed.1" }, { line: "bed.2" }],
  [Interactable.Wardrobe]: [
    {
      line: "wardrobe.1",
      options: [
        {
          type: "prompt.yes",
          onClick: onPlayerChangeClothes,
        },
        { type: "prompt.no" },
      ],
    },
    { line: "wardrobe.1.yes" },
  ],
  [Interaction.Introduction]: [
    {
      line: "intro.1",
    },
    {
      line: "intro.2",
    },
    { line: "intro.3" },
    { line: "intro.4" },
  ],
  [Interaction.ShahidToHafsah]: [],
  [Interaction.HafsahToShahid]: [],
};

export default dialog;
