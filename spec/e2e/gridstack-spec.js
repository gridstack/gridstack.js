describe('gridstack.js with height', function() {
    beforeAll(function() {
        browser.ignoreSynchronization = true;
    });

    beforeEach(function() {
        browser.get('http://localhost:8080/spec/e2e/html/gridstack-with-height.html');
    });

    it('shouldn\'t throw exeption when dragging widget outside the grid', function() {
        var widget = element(by.id('item-1'));
        var gridContainer = element(by.id('grid'));

        browser.actions()
            .mouseDown(widget, {x: 20, y: 20})
            .mouseMove(gridContainer, {x: 300, y: 20})
            .mouseUp()
            .perform();

        browser.manage().logs().get('browser').then(function(browserLog) {
            expect(browserLog.length).toEqual(0);
        });
    });
});
