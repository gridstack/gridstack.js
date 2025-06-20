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
      expect(Utils.parseHeight('12.5cm')).toEqual(jasmine.objectContaining({h: 12.5, unit: 'cm'}));
      expect(Utils.parseHeight('12.5mm')).toEqual(jasmine.objectContaining({h: 12.5, unit: 'mm'}));
      expect(Utils.parseHeight('12.5')).toEqual(jasmine.objectContaining({h: 12.5, unit: 'px'}));
      expect(function() { Utils.parseHeight('12.5 df'); }).toThrowError('Invalid height val = 12.5 df');
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
      expect(Utils.parseHeight('-12.3cm')).toEqual(jasmine.objectContaining({h: -12.3, unit: 'cm'}));
      expect(Utils.parseHeight('-12.3mm')).toEqual(jasmine.objectContaining({h: -12.3, unit: 'mm'}));
      expect(Utils.parseHeight('-12.5')).toEqual(jasmine.objectContaining({h: -12.5, unit: 'px'}));
      expect(function() { Utils.parseHeight('-12.5 df'); }).toThrowError('Invalid height val = -12.5 df');
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

  describe('_getScrollAmount', () => {
    const innerHeight = 800;
    const elHeight = 600;

    it('should not scroll if element is inside viewport', () => {
      const rect = { top: 100, bottom: 700, left: 0, right: 0, width: 50, height: 50, toJSON: () => '' };
      const scrollAmount = Utils._getScrollAmount(rect as DOMRect, innerHeight, elHeight, -10);
      expect(scrollAmount).toBe(0);
    });

    it('should not limit the scroll speed if the user has set maxScrollSpeed to 0', () => {
      const rect = { top: 220, bottom: 850, left: 0, right: 0, width: 50, height: 50, toJSON: () => '' };
      const scrollAmount = Utils._getScrollAmount(rect as DOMRect, innerHeight, elHeight, 50);
      expect(scrollAmount).toBe(50);
    });

    it('should treat a negative maxScrollSpeed as positive', () => {
      const rect = { top: 220, bottom: 850, left: 0, right: 0, width: 50, height: 50, toJSON: () => '' };
      const scrollAmount = Utils._getScrollAmount(rect as DOMRect, innerHeight, elHeight, 50, -4 );
      expect(scrollAmount).toBe(4);
    });

    describe('scrolling up', () => {
      it('should scroll up', () => {
        const rect = { top: -20, bottom: 580, left: 0, right: 0, width: 50, height: 50, toJSON: () => '' };
        const scrollAmount = Utils._getScrollAmount(rect as DOMRect, innerHeight, elHeight, -30);
        expect(scrollAmount).toBe(-20);
      });
      it('should scroll up to bring dragged element into view', () => {
        const rect = { top: -20, bottom: 580, left: 0, right: 0, width: 50, height: 50, toJSON: () => '' };
        const scrollAmount = Utils._getScrollAmount(rect as DOMRect, innerHeight, elHeight, -10);
        expect(scrollAmount).toBe(-10);
      });
      it('should scroll up when dragged element is larger than viewport', () => {
        const rect = { top: -20, bottom: 880, left: 0, right: 0, width: 50, height: 50, toJSON: () => '' };
        const scrollAmount = Utils._getScrollAmount(rect as DOMRect, innerHeight, 900, -30);
        expect(scrollAmount).toBe(-30);
      });

      it('should limit the scroll speed when the expected scroll speed is greater than the maxScrollSpeed', () => {
        const rect = { top: -30, bottom: 880, left: 0, right: 0, width: 50, height: 50, toJSON: () => '' };
        const scrollAmountWithoutLimit = Utils._getScrollAmount(rect as DOMRect, innerHeight, elHeight, -30);
        expect(scrollAmountWithoutLimit).toBe(-30); // be completely sure that the scroll amount should be limited

        const scrollAmount = Utils._getScrollAmount(rect as DOMRect, innerHeight, elHeight, -30, 10);
        expect(scrollAmount).toBe(-10);
      });
    });

    describe('scrolling down', () => {
      it('should not scroll down if element is inside viewport', () => {
        const rect = { top: 100, bottom: 700, left: 0, right: 0, width: 50, height: 50, toJSON: () => '' };
        const scrollAmount = Utils._getScrollAmount(rect as DOMRect, innerHeight, elHeight, 10);
        expect(scrollAmount).toBe(0);
      });
      it('should scroll down', () => {
        const rect = { top: 220, bottom: 820, left: 0, right: 0, width: 50, height: 50, toJSON: () => '' };
        const scrollAmount = Utils._getScrollAmount(rect as DOMRect, innerHeight, elHeight, 10);
        expect(scrollAmount).toBe(10);
      });
      it('should scroll down to bring dragged element into view', () => {
        const rect = { top: 220, bottom: 820, left: 0, right: 0, width: 50, height: 50, toJSON: () => '' };
        const scrollAmount = Utils._getScrollAmount(rect as DOMRect, innerHeight, elHeight, 30);
        expect(scrollAmount).toBe(20);
      });
      it('should scroll down when dragged element is larger than viewport', () => {
        const rect = { top: -100, bottom: 820, left: 0, right: 0, width: 50, height: 50, toJSON: () => '' };
        const scrollAmount = Utils._getScrollAmount(rect as DOMRect, innerHeight, 920, 10);
        expect(scrollAmount).toBe(10);
      });

      it('should limit the scroll speed when the expected scroll speed is greater than the maxScrollSpeed', () => {
        const rect = { top: 220, bottom: 850, left: 0, right: 0, width: 50, height: 50, toJSON: () => '' };
        const scrollAmountWithoutLimit = Utils._getScrollAmount(rect as DOMRect, innerHeight, elHeight, 50);
        expect(scrollAmountWithoutLimit).toBe(50); // be completely sure that the scroll amount should be limited

        const scrollAmount = Utils._getScrollAmount(rect as DOMRect, innerHeight, elHeight, 10, 10);
        expect(scrollAmount).toBe(10);
      });
    });
  });

  describe('clone', () => {
    const a: any = {first: 1, second: 'text'};
    const b: any = {first: 1, second: {third: 3}};
    const c: any = {first: 1, second: [1, 2, 3], third: { fourth: {fifth: 5}}};
    it('Should have the same values', () => {
      const z = Utils.clone(a);
      expect(z).toEqual({first: 1, second: 'text'});
    });
    it('Should have 2 in first key, and original unchanged', () => {
      const z = Utils.clone(a);
      z.first = 2;
      expect(a).toEqual({first: 1, second: 'text'});
      expect(z).toEqual({first: 2, second: 'text'});
    });
    it('Should have new string in second key, and original unchanged', () => {
      const z = Utils.clone(a);
      z.second = 2;
      expect(a).toEqual({first: 1, second: 'text'});
      expect(z).toEqual({first: 1, second: 2});
    });
    it('new string in both cases - use cloneDeep instead', () => {
      const z = Utils.clone(b);
      z.second.third = 'share';
      expect(b).toEqual({first: 1, second: {third: 'share'}});
      expect(z).toEqual({first: 1, second: {third: 'share'}});
    });
    it('Array Should match', () => {
      const z = Utils.clone(c);
      expect(c).toEqual({first: 1, second: [1, 2, 3], third: { fourth: {fifth: 5}}});
      expect(z).toEqual({first: 1, second: [1, 2, 3], third: { fourth: {fifth: 5}}});
    });
    it('Array[0] changed in both cases - use cloneDeep instead', () => {
      const z = Utils.clone(c);
      z.second[0] = 0;
      expect(c).toEqual({first: 1, second: [0, 2, 3], third: { fourth: {fifth: 5}}});
      expect(z).toEqual({first: 1, second: [0, 2, 3], third: { fourth: {fifth: 5}}});
    });
    it('fifth changed in both cases - use cloneDeep instead', () => {
      const z = Utils.clone(c);
      z.third.fourth.fifth = 'share';
      expect(c).toEqual({first: 1, second: [0, 2, 3], third: { fourth: {fifth: 'share'}}});
      expect(z).toEqual({first: 1, second: [0, 2, 3], third: { fourth: {fifth: 'share'}}});
    });
  });
  describe('cloneDeep', () => {
    // reset our test cases
    const a: any = {first: 1, second: 'text'};
    const b: any = {first: 1, second: {third: 3}};
    const c: any = {first: 1, second: [1, 2, 3], third: { fourth: {fifth: 5}}};
    const d: any = {first: [1, [2, 3], ['four', 'five', 'six']]};
    const e: any = {first: 1, __skip: {second: 2}};
    const f: any = {first: 1, _dontskip: {second: 2}};
  
    it('Should have the same values', () => {
      const z = Utils.cloneDeep(a);
      expect(z).toEqual({first: 1, second: 'text'});
    });
    it('Should have 2 in first key, and original unchanged', () => {
      const z = Utils.cloneDeep(a);
      z.first = 2;
      expect(a).toEqual({first: 1, second: 'text'});
      expect(z).toEqual({first: 2, second: 'text'});
    });
    it('Should have new string in second key, and original unchanged', () => {
      const z = Utils.cloneDeep(a);
      z.second = 2;
      expect(a).toEqual({first: 1, second: 'text'});
      expect(z).toEqual({first: 1, second: 2});
    });
    it('Should have new string nested object, and original unchanged', () => {
      const z = Utils.cloneDeep(b);
      z.second.third = 'diff';
      expect(b).toEqual({first: 1, second: {third: 3}});
      expect(z).toEqual({first: 1, second: {third: 'diff'}});
    });
    it('Array Should match', () => {
      const z = Utils.cloneDeep(c);
      expect(c).toEqual({first: 1, second: [1, 2, 3], third: { fourth: {fifth: 5}}});
      expect(z).toEqual({first: 1, second: [1, 2, 3], third: { fourth: {fifth: 5}}});
    });
    it('Array[0] changed in z only', () => {
      const z = Utils.cloneDeep(c);
      z.second[0] = 0;
      expect(c).toEqual({first: 1, second: [1, 2, 3], third: { fourth: {fifth: 5}}});
      expect(z).toEqual({first: 1, second: [0, 2, 3], third: { fourth: {fifth: 5}}});
    });
    it('nested firth element changed only in z', () => {
      const z = Utils.cloneDeep(c);
      z.third.fourth.fifth = 'diff';
      expect(c).toEqual({first: 1, second: [1, 2, 3], third: { fourth: {fifth: 5}}});
      expect(z).toEqual({first: 1, second: [1, 2, 3], third: { fourth: {fifth: 'diff'}}});
    });
    it('nested array only has one item changed', () => {
      const z = Utils.cloneDeep(d);
      z.first[1] = 'two';
      z.first[2][2] = 6;
      expect(d).toEqual({first: [1, [2, 3], ['four', 'five', 'six']]});
      expect(z).toEqual({first: [1, 'two',  ['four', 'five', 6]]});
    });
    it('skip __ items so it mods both instance', () => {
      const z = Utils.cloneDeep(e);
      z.__skip.second = 'two';
      expect(e).toEqual({first: 1, __skip: {second: 'two'}}); // TODO support clone deep of function workaround
      expect(z).toEqual({first: 1, __skip: {second: 'two'}});
    });
    it('correctly copy _ item', () => {
      const z = Utils.cloneDeep(f);
      z._dontskip.second = 'two';
      expect(f).toEqual({first: 1, _dontskip: {second: 2}});
      expect(z).toEqual({first: 1, _dontskip: {second: 'two'}});
    });
  });  
});
