describe('gridstack.js two grids demo', function() {
    beforeAll(function() {
        browser.ignoreSynchronization = true;
    });

    beforeEach(function() {
        browser.get('http://localhost:8080/demo/two.html');
    });

    it('should have proper title', function() {
        expect(browser.getTitle()).toEqual('Two grids demo');
    });
});
