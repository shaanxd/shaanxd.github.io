import { DialogParams } from "../types";

export const onResumeClick = () => {
  window.open("resume.pdf", "_blank");
};

export const onPlayerChangeClothes = ({ player }: DialogParams) => {
  player.change();
};
