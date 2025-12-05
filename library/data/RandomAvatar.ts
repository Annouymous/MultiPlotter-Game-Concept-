const Avatars = [
  "https://i.pinimg.com/736x/a8/e6/74/a8e674b751c12f3bcda039f5d949d397.jpg",
  "https://i.pinimg.com/736x/de/ab/fe/deabfe0f4d02b1efad6d611569521241.jpg",
  "https://i.pinimg.com/736x/29/e0/d1/29e0d115829fd538262e1a1eadc58b8c.jpg",
  "https://i.pinimg.com/736x/f7/f2/e5/f7f2e51deec425e026a60acb6f3328c6.jpg",
  "https://i.pinimg.com/736x/3c/26/11/3c2611ffa393cd4f0407aeea219f3eeb.jpg",
  "https://i.pinimg.com/736x/ed/b7/4b/edb74b21863ac78f57fb3c568b8ce0cb.jpg",
  "https://i.pinimg.com/736x/60/46/8b/60468b01f8f20174688e1cac3d265ba2.jpg",
  "https://i.pinimg.com/736x/c4/21/42/c42142488147c9145dc14778eadbfecb.jpg",
  "https://i.pinimg.com/736x/35/e3/38/35e3384fd1cac46b0329c725631b6fec.jpg",
  "https://i.pinimg.com/736x/11/4a/3c/114a3c81051f6abbd4fce2ba1c5a6812.jpg",
];

export const GetRandomAvatar = () => {
  const randomIndex = Math.floor(Math.random() * Avatars.length);
  return Avatars[randomIndex];
};
