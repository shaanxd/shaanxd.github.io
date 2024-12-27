import { Interactable, Interaction } from "./enums";
import { Dialog, KeyValuePair } from "./types";

const locales: KeyValuePair<Dialog[]> = {
  [Interactable.BalconyView]: [
    { line: "Ah Berlin! Such a magnificient city..." },
    { line: "A bit hungry. Need to get some doner soon..." },
  ],
  [Interactable.ComputerTable]: [
    { line: "This is where I tend to work and play games." },
    { line: "Playing a lot of League of Legends these days." },
    {
      line: "Would you like to take a look at my resume?",
      options: [
        {
          type: "Yes",
          onClick: () => {
            window.open("resume.pdf", "_blank");
          },
        },
        {
          type: "No",
        },
      ],
    },
  ],
  [Interactable.KitchenCounter]: [{ line: "Started baking a while back..." }],
  [Interactable.Luggage]: [{ line: "I miss home..." }],
  [Interactable.TVTable]: [
    { line: "Gotta get back for some Expedition 33..." },
  ],
  [Interactable.Bed]: [
    { line: "YAAWWWWWWNNNNNNNN!!!!!" },
    { line: "Sorry....." },
  ],
  [Interactable.Wardrobe]: [
    {
      line: "Change of clothes?",
      options: [
        {
          type: "Yes",
          onClick: ({ player }) => {
            player.change();
          },
        },
        { type: "No" },
      ],
    },
    { line: "Neat!" },
  ],
  [Interaction.Introduction]: [
    {
      line: "Hi there! Welcome to my portfolio :)",
    },
    {
      line: "You can use the WASD keys to move and take a look around.",
    },
    { line: "If you're on mobile you can use the touch screen too!" },
    { line: "Please enjoy your stay! :P" },
  ],
  [Interaction.ShahidToHafsah]: [
    { line: "Meet my wifey! :)." },
    { line: "Everyone say hi to Hafsah! :)" },
    { line: "She is the best!" },
  ],
  [Interaction.HafsahToShahid]: [{ line: "Hello! :)" }],
};

export default locales;
