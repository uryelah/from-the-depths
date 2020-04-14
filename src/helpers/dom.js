const cleanKeyPress = () => {
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  }, false);
};

export default cleanKeyPress;
