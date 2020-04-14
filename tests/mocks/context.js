const context = (() => {
  let num = 0;
  return ({
    ts: {
      currentFrame: num,
      frameLength: 3,
      setFrame: (n) => {
        num = n;
      },
      getFrame: () => num,
    },
  });
})();

export default context;
