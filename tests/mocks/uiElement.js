const uiElement = (() => {
  let set = true;

  const scoreObj = {
    x: 0,
    y: 0,
    color: 'transparent',
    text: '',
    font: 'Ariel',
    setColor: (color = 'transparent') => color,
    destroy() {
      set = false;
    },
  };
  const hpObj = {
    x: 0,
    y: 0,
    color: 'transparent',
    text: '',
    font: 'Ariel',
    setColor: (color = 'transparent') => color,
    destroy() {
      set = false;
    },
  };
  return {
    score: (() => {
      if (set) {
        return scoreObj;
      }
      return null;
    })(),
    hp: (() => {
      if (set) {
        return hpObj;
      }
      return null;
    })(),
    add: {
      text: (x, y, text, font) => ({
        x,
        y,
        text,
        font,
        setColor(color = 'transparent') {
          scoreObj.color = color;
          return scoreObj;
        },
        destroy() {
          set = false;
        },
      }),
    },
    player: {
      getScore: () => 1,
      getHp: () => 200,
    },
  };
})();

export default uiElement;
