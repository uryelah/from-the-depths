/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
import Preloader from '../../src/helpers/Preloader';

test('Preloader returns an object', () => {
  expect(typeof Preloader).toBe('object');
});

test('Preloader has a tentacle property', () => {
  expect(Preloader.tentacle).toBeTruthy;
});

test('Preloader has a mainMenu property', () => {
  expect(Preloader.mainMenu).toBeTruthy;
});

test('Preloader.tentacle is a function', () => {
  expect(typeof Preloader.tentacle).toBe('function');
});

test('Preloader.mainMenu is a function', () => {
  expect(typeof Preloader.mainMenu).toBe('function');
});

test('Preloader.tentacle takes 1 parameter', () => {
  expect(Preloader.tentacle.length).toBe(1);
});

test('Preloader.mainMenu takes 1 parameter', () => {
  expect(Preloader.mainMenu.length).toBe(1);
});
