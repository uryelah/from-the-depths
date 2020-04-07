/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
import Text from '../../src/helpers/text';

test('Text is an object', () => {
  expect(typeof Text).toBe('object');
});

describe('Text.addSubtitle', () => {
  test('it is a property of Text', () => {
    expect(Text.addSubtitle).toBeTruthy;
  });

  test('it is a function', () => {
    expect(typeof Text.addSubtitle).toBe('function');
  });
});


describe('Text.addTitleText', () => {
  test('it is a property of Text', () => {
    expect(Text.addTitleText).toBeTruthy;
  });

  test('it is a function', () => {
    expect(typeof Text.addTitleText).toBe('function');
  });
});


describe('Text.addNoticeText', () => {
  test('it is a property of Text', () => {
    expect(Text.addNoticeText).toBeTruthy;
  });

  test('it is a function', () => {
    expect(typeof Text.addNoticeText).toBe('function');
  });
});


describe('Text.addListText', () => {
  test('it is a property of Text', () => {
    expect(Text.addListText).toBeTruthy;
  });

  test('it is a function', () => {
    expect(typeof Text.addListText).toBe('function');
  });
});
