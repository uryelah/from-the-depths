const Player = (config) => {
  let { hp, body } = config;

  let still = true;

  let score = 0;

  const isStill = () => still;

  const setStill = (bool) => {
    still = bool;
  };

  const getScore = () => score;

  const add2Score = (n) => {
    score += n;
  };

  const decrementHp = (n) => {
    hp -= n;
  };

  const incrementHp = (n) => {
    hp += n;
  };

  const getHp = () => hp;

  const setBody = (obj) => {
    body = obj;
  };

  const getBody = () => body;

  return {
    decrementHp,
    incrementHp,
    getHp,
    setBody,
    isStill,
    setStill,
    getScore,
    add2Score,
    getBody,
  };
};

export default Player;
