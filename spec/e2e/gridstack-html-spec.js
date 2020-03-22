describe('gridstack.js with height', function() {
  beforeAll(function() {
    browser.ignoreSynchronization = true;
  });

  beforeEach(function() {
    browser.get('http://localhost:8080/spec/e2e/html/gridstack-with-height.html');
  });

  it('shouldn\'t throw exception when dragging widget outside the grid', function() {
    let widget = element(by.id('item-1'));
    let gridContainer = element(by.id('grid'));

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

describe('grid elements with no x,y positions', function() {
  beforeAll(function() {
    browser.ignoreSynchronization = true;
  });

  beforeEach(function() {
    browser.get('http://localhost:8080/spec/e2e/html/1017-items-no-x-y-for-autoPosition.html');
  });

  it('should match positions in order 5,1,2,4,3', function() {
    // TBD
    // expect(null).not.toBeNull();
  });
});