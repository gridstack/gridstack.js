import { Utils } from '../src/utils';

describe('gridstack utils', function() {
  'use strict';

  describe('setup of utils', function() {
    it('should set gridstack Utils.', function() {
      let utils = Utils;
      expect(utils).not.toBeNull();
      expect(typeof utils).toBe('function');
    });
  });

  describe('test toBool', function() {
    it('should return booleans.', function() {
      expect(Utils.toBool(true)).toEqual(true);
      expect(Utils.toBool(false)).toEqual(false);
    });
    it('should work with integer.', function() {
      expect(Utils.toBool(1)).toEqual(true);
      expect(Utils.toBool(0)).toEqual(false);
    });
    it('should work with Strings.', function() {
      expect(Utils.toBool('')).toEqual(false);
      expect(Utils.toBool('0')).toEqual(false);
      expect(Utils.toBool('no')).toEqual(false);
      expect(Utils.toBool('false')).toEqual(false);
      expect(Utils.toBool('yes')).toEqual(true);
      expect(Utils.toBool('yadda')).toEqual(true);
    });
  });

  describe('test isIntercepted', function() {
    let src = {x: 3, y: 2, w: 3, h: 2};

    it('should intercept.', function() {
      expect(Utils.isIntercepted(src, {x: 0, y: 0, w: 4, h: 3})).toEqual(true);
      expect(Utils.isIntercepted(src, {x: 0, y: 0, w: 40, h: 30})).toEqual(true);
      expect(Utils.isIntercepted(src, {x: 3, y: 2, w: 3, h: 2})).toEqual(true);
      expect(Utils.isIntercepted(src, {x: 5, y: 3, w: 3, h: 2})).toEqual(true);
    });
    it('shouldn\'t intercept.', function() {
      expect(Utils.isIntercepted(src, {x: 0, y: 0, w: 3, h: 2})).toEqual(false);
      expect(Utils.isIntercepted(src, {x: 0, y: 0, w: 13, h: 2})).toEqual(false);
      expect(Utils.isIntercepted(src, {x: 1, y: 4, w: 13, h: 2})).toEqual(false);
      expect(Utils.isIntercepted(src, {x: 0, y: 3, w: 3, h: 2})).toEqual(false);
      expect(Utils.isIntercepted(src, {x: 6, y: 3, w: 3, h: 2})).toEqual(false);
    });
  });

  describe('test createStylesheet/removeStylesheet', function() {

    it('should create/remove style DOM', function() {
      let _id = 'test-123';
      Utils.createStylesheet(_id);

      let style = document.querySelector('STYLE[gs-style-id=' + _id + ']');
      expect(style).not.toBe(null);
      // expect(style.prop('tagName')).toEqual('STYLE');

      Utils.removeStylesheet(_id)
      style = document.querySelector('STYLE[gs-style-id=' + _id + ']');
      expect(style).toBe(null);
    });

  });

  describe('test parseHeight', function() {

    it('should parse height value', function() {
      expect(Utils.parseHeight(12)).toEqual(jasmine.objectContaining({h: 12, unit: 'px'}));
      expect(Utils.parseHeight('12px')).toEqual(jasmine.objectContaining({h: 12, unit: 'px'}));
      expect(Utils.parseHeight('12.3px')).toEqual(jasmine.objectContaining({h: 12.3, unit: 'px'}));
      expect(Utils.parseHeight('12.3em')).toEqual(jasmine.objectContaining({h: 12.3, unit: 'em'}));
      expect(Utils.parseHeight('12.3rem')).toEqual(jasmine.objectContaining({h: 12.3, unit: 'rem'}));
      expect(Utils.parseHeight('12.3vh')).toEqual(jasmine.objectContaining({h: 12.3, unit: 'vh'}));
      expect(Utils.parseHeight('12.3vw')).toEqual(jasmine.objectContaining({h: 12.3, unit: 'vw'}));
      expect(Utils.parseHeight('12.3%')).toEqual(jasmine.objectContaining({h: 12.3, unit: '%'}));
      expect(Utils.parseHeight('12.5')).toEqual(jasmine.objectContaining({h: 12.5, unit: 'px'}));
      expect(function() { Utils.parseHeight('12.5 df'); }).toThrowError('Invalid height');
    });

    it('should parse negative height value', function() {
      expect(Utils.parseHeight(-12)).toEqual(jasmine.objectContaining({h: -12, unit: 'px'}));
      expect(Utils.parseHeight('-12px')).toEqual(jasmine.objectContaining({h: -12, unit: 'px'}));
      expect(Utils.parseHeight('-12.3px')).toEqual(jasmine.objectContaining({h: -12.3, unit: 'px'}));
      expect(Utils.parseHeight('-12.3em')).toEqual(jasmine.objectContaining({h: -12.3, unit: 'em'}));
      expect(Utils.parseHeight('-12.3rem')).toEqual(jasmine.objectContaining({h: -12.3, unit: 'rem'}));
      expect(Utils.parseHeight('-12.3vh')).toEqual(jasmine.objectContaining({h: -12.3, unit: 'vh'}));
      expect(Utils.parseHeight('-12.3vw')).toEqual(jasmine.objectContaining({h: -12.3, unit: 'vw'}));
      expect(Utils.parseHeight('-12.3%')).toEqual(jasmine.objectContaining({h: -12.3, unit: '%'}));
      expect(Utils.parseHeight('-12.5')).toEqual(jasmine.objectContaining({h: -12.5, unit: 'px'}));
      expect(function() { Utils.parseHeight('-12.5 df'); }).toThrowError('Invalid height');
    });
  });

  describe('test defaults', function() {
    it('should assign missing field or undefined', function() {
      let src: any = {};
      expect(src).toEqual({});
      expect(Utils.defaults(src, {x: 1, y: 2})).toEqual({x: 1, y: 2});
      expect(Utils.defaults(src, {x: 10})).toEqual({x: 1, y: 2});
      src.w = undefined;
      expect(src).toEqual({x: 1, y: 2, w: undefined});
      expect(Utils.defaults(src, {x: 10, w: 3})).toEqual({x: 1, y: 2, w: 3});
      expect(Utils.defaults(src, {h: undefined})).toEqual({x: 1, y: 2, w: 3, h: undefined});
      src = {x: 1, y: 2, sub: {foo: 1, two: 2}};
      expect(src).toEqual({x: 1, y: 2, sub: {foo: 1, two: 2}});
      expect(Utils.defaults(src, {x: 10, w: 3})).toEqual({x: 1, y: 2, w: 3, sub: {foo: 1, two: 2}});
      expect(Utils.defaults(src, {sub: {three: 3}})).toEqual({x: 1, y: 2, w: 3, sub: {foo: 1, two: 2, three: 3}});
    });
  });

  describe('removePositioningStyles', function() {
    it('should remove styles', function() {
      let doc = document.implementation.createHTMLDocument();
      doc.body.innerHTML = '<div style="position: absolute; left: 1; top: 2; w: 3; h: 4"></div>';
      let el = doc.body.children[0] as HTMLElement;
      expect(el.style.position).toEqual('absolute');
      // expect(el.style.left).toEqual('1'); // not working!

      Utils.removePositioningStyles(el);
      expect(el.style.position).toEqual('');

      // bogus test
      expect(Utils.getScrollElement(el)).not.toBe(null);
      // bogus test
      Utils.updateScrollPosition(el, {top: 20}, 10);
    });
  });

});
