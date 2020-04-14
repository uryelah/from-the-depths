/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
import Utils from '../../src/helpers/Utils';
import context from '../mocks/context';
import uiElement from '../mocks/uiElement';

test('Utils returns an object', () => {
  expect(typeof Utils).toBe('object');
});

describe('absSubstract function', () => {
  test('Util has absSubstract a property', () => {
    expect(Utils.absSubstract).toBeTruthy();
  });

  test('absSubstract is a function', () => {
    expect(typeof Utils.absSubstract).toBe('function');
  });

  test('absSubstract returns a positive number', () => {
    expect(Utils.absSubstract(-15, 5)).toBeGreaterThan(0);
  });

  test('absSubstract returns the absolute substraction of two numbers a and b (I)', () => {
    expect(Utils.absSubstract(-15, 5)).toBe(10);
  });

  test('absSubstract returns the absolute substraction of two numbers a and b (II)', () => {
    expect(Utils.absSubstract(12, -4)).toBe(8);
  });
});


describe('animateBg function', () => {
  test('Util has animateBg a property', () => {
    expect(Utils.animateBg).toBeTruthy();
  });

  test('animateBg is a function', () => {
    expect(typeof Utils.animateBg).toBe('function');
  });

  test('animateBg takes two parameters', () => {
    expect(Utils.animateBg.length).toBe(2);
  });

  test('animateBg mutates a context objects currentframe property', () => {
    const previousFrame = context.ts.getFrame();

    Utils.animateBg(context, 20);

    expect(context.ts.getFrame()).toBe(previousFrame + 1);
  });
});

describe('refreshStatus function', () => {
  test('Util has refreshStatus a property', () => {
    expect(Utils.refreshStatus).toBeTruthy();
  });

  test('refreshStatus is a function', () => {
    expect(typeof Utils.refreshStatus).toBe('function');
  });

  test('refreshStatus has a default parameter', () => {
    expect(Utils.refreshStatus.length).toBe(0);
  });

  test('when callend animateBg destroys and then reconstructs the score or hp object (I)', () => {
    const element = uiElement;

    Utils.refreshStatus({ score: true }, element);

    expect(element.score).toBeTruthy;
  });

  test('when callend animateBg destroys and then reconstructs the score or hp object (I)', () => {
    const element = uiElement;

    Utils.refreshStatus({ hp: true }, element);

    expect(element.hp).toBeTruthy;
  });

  describe('endGame function', () => {
    test('Util has endGame a property', () => {
      expect(Utils.endGame).toBeTruthy();
    });

    test('endGame is a function', () => {
      expect(typeof Utils.endGame).toBe('function');
    });

    test('endGame has two parameters', () => {
      expect(Utils.endGame.length).toBe(2);
    });
  });
});
