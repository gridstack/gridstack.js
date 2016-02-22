describe('gridstack utils', function() {
    'use strict';

    var utils;

    beforeEach(function() {
        utils = window.GridStackUI.Utils;
    });

    describe('setup of utils', function() {

        it('should set gridstack utils.', function() {
            expect(utils).not.toBeNull();
            expect(typeof utils).toBe('object');
        });

    });

    describe('test toBool', function() {

        it('should return booleans.', function() {
            expect(utils.toBool(true)).toEqual(true);
            expect(utils.toBool(false)).toEqual(false);
        });

        it('should work with integer.', function() {
            expect(utils.toBool(1)).toEqual(true);
            expect(utils.toBool(0)).toEqual(false);
        });

        it('should work with Strings.', function() {
            expect(utils.toBool('')).toEqual(false);
            expect(utils.toBool('0')).toEqual(false);
            expect(utils.toBool('no')).toEqual(false);
            expect(utils.toBool('false')).toEqual(false);
            expect(utils.toBool('yes')).toEqual(true);
            expect(utils.toBool('yadda')).toEqual(true);
        });

    });


});