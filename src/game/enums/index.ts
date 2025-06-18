export enum Scene {
  Apartment = "Apartment",
  Balcony = "Balcony",
}

export enum Character {
  Shahid = "shahid",
  Hafsah = "hafsah",
}

export enum PlayerAnimation {
  IdleUp = "IdleUp",
  IdleDown = "IdleDown",
  IdleSide = "IdleSide",
  WalkUp = "WalkUp",
  WalkDown = "WalkDown",
  WalkSide = "WalkSide",
  Read = "Read",
  CheckPhone = "CheckPhone",
}

export enum PlayerSpawn {
  Player = "player",
  PlayerApartment = "player-apartment",
  PlayerBalcony = "player-balcony",
}

export enum PlayerMove {
  Up = "Up",
  Down = "Down",
  Left = "Left",
  Right = "Right",
}

export enum Layer {
  Player = "Player",
  CharactersBackground = "CharactersBackground",
  CharactersForeground = "CharactersForeground",
  Doors = "Doors",
  VerticalDoors = "VerticalDoors",
}

export enum Interactable {
  TVTable = "tv-table",
  ComputerTable = "computer-table",
  KitchenCounter = "kitchen-counter",
  Luggage = "luggage",
  BalconyView = "balcony-view",
  BalconyEntrance = "balcony-entrance",
  RoomEntrance = "room-entrance",
  ApartmentEntrance = "apartment-entrance",
  BathroomEntrance = "bathroom-entrance",
  Bed = "bed",
  Wardrobe = "wardrobe",
}

export enum Interaction {
  Intro = "intro",
  IntroBrief = "intro-brief",
  ShahidToHafsah = "shahid-to-hafsah",
  HafsahToShahid = "hafsah-to-shahid",
}

export enum Door {
  BalconyEntrance = "balcony-entrance-door",
  RoomEntrance = "room-entrance-door",
  BathroomEntrance = "bathroom-entrance-door",
  WorldEntrance = "world-entrance-door",
}

export enum DoorAnimation {
  Open = "Open",
  Closed = "Closed",
}

export enum NPCAnimation {
  IdleDown = "IdleDown",
  IdleUp = "IdleUp",
  IdleSide = "IdleSide",
  IdleSitSide = "IdleSitSide",
  CheckPhone = "CheckPhone",
  Read = "Read",
}

export enum VehicleAnimation {
  IdleSide = "IdleSide",
}

export enum Animal {
  Cat = "Cat",
}

export enum AnimalAnimation {
  Idle = "Idle",
}

export enum PortraitAnimation {
  Idle = "Idle",
  Agree = "Agree",
  Disagree = "Disagree",
}

export enum Locales {
  En = "En",
  De = "De",
  Fr = "Fr",
  Nl = "Nl",
  Es = "Es",
}

export enum UILabels {
  SFX = "sfx-text",
  Music = "music-text",
  Settings = "settings-title",
  Locales = "locales-title",
  Credits = "credits-title",
  ExternalLinks = "external-links-title",
  PersonalInfo = "personal-info-text",
  Info = "info-title",
}

export enum UIPlacements {
  Flags = "flags",
  Buttons = "buttons",
}

export enum UIButtonType {
  Home = "Home",
  Question = "Question",
  Information = "Information",
  Settings = "Settings",
}

export enum Socials {
  Email = "email",
  GitHub = "github",
  Instagram = "instagram",
  LinkedIn = "linkedin",
}

export enum Credits {
  Tileset = "tileset",
  Music = "music",
  Flags = "flags",
  Library = "library",
}
