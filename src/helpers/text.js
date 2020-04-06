const Text = (() => ({
  addSubtitle: (location, alignement, cor, text) => location.add.text(location.game.config.width * 0.5, location.game.config.height - 60, text, {
    fontFamily: 'bookman',
    fontSize: 24,
    fontStyle: 'bold',
    color: cor,
    align: alignement,
  }),

  addListText: (location, alignement, cor, text, i, left, weight = 'bold') => location.add.text((location.game.config.width * left), 170 + (25 * i), text, {
    fontFamily: 'bookman',
    fontSize: 20,
    fontStyle: weight,
    color: cor,
    align: alignement,
  }),

  addTitleText: (location, text, x = location.game.config.width * 0.5, y = 128, alignment = 'center', size = 40) => location.add.text(x, y, text, {
    fontFamily: 'bookman',
    fontSize: size,
    fontStyle: 'bold',
    color: '#ffffff',
    align: alignment,
  }),

  addNoticeText: (location, text, x, y, alignment, cor) => location.add.text(x, y, text, {
    fontFamily: 'monospace',
    fontSize: 30,
    fontStyle: 'normal',
    color: cor,
    align: alignment,
  }),
}))();

export default Text;
