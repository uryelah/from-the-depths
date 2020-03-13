const SpearControllers = (() => ({
  moveSpears: (context) => {
    context.spears.forEach((spear, i) => {
      spear.y += spear.velocity.y;
      spear.x += spear.velocity.x;

      if (spear.x < 0 || spear.x > context.game.config.width
          || spear.y < 0 || spear.y > context.game.config.height) {
        spear.destroy();
        context.spears[i] = null;
      }
    });
  },
}))();

export default SpearControllers;
