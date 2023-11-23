const { expect } = require('@playwright/test');

const { BasePage } = require('./base');

export class WebstudioPage extends BasePage {
  constructor(page) {
      super(page);
      this.route = '/webstudio';
      this.selectors = {
        ...this.selectors,
        tourCloseBtn: '.tour-container > .fa-close',
        artboardNav: '#draw-drawing-panel > .drawingPanel-items > div > .drawing-panel-image-icon',
        plainArtboardChoice: ':nth-child(1) > .home-card-list-body > .home-card-image-container > .home-card-img',
        container: '#Artboard1 #section1',
        barChart: 'img[src*="Bar Chart.svg"]',
        artTypeListContainer: '#flavour-scroll div',
        artTypes: '#flavourimage',
        canvas: 'canvas',
        sizeField: '.spk-color',
        heightUnitSelect: 'app-value-unit:nth-child(4) > div > .select-unit',
        heightField: 'app-value-unit:nth-child(4) > div > .spk-color',
      };
  }

  async skipTour() {
    await this.page.click(this.selectors.tourCloseBtn);
  }

  async dropArtboard() {
    await this.page.click(this.selectors.artboardNav);
    await this.page.click(this.selectors.plainArtboardChoice);
  }

  async containerBoundaryBox() {
    const container = await this.assertContainer();
    const box = await container.boundingBox();
    return box;
  }

  async dropChart() {
    const chartsListBtn = await this.page.getByText('Chart');
    await chartsListBtn.click();
    await this.page.waitForSelector(this.selectors.barChart);
    await chartsListBtn.hover();
    await this.page.locator(this.selectors.artTypeListContainer)
              .filter({ hasText: 'ActionableAction Sheet' })
              .locator(this.selectors.artTypes)
              .first()
              .click();
  }

  async canvasBoundaryBox() {
    const canvas = await this.assertCanvas();
    const box = await canvas.boundingBox();
    return box;
  }

  async centerizeCanvas() {
    const canvas = await this.assertCanvas();
    await canvas.click();
    await this.page.getByRole('button', { name: 'C | C' }).click();
  }

  async fitCanvas() {
    await this.page.locator(this.selectors.sizeField).first().fill('100');
    await this.page.selectOption(this.selectors.heightUnitSelect, '%');
    await this.page.locator(this.selectors.heightField).fill('100');
  }

  async assertContainer() {
    const container = await this.page.locator(this.selectors.container);
    await expect(container).toBeTruthy();
    return container;
  }

  async assertCanvas() {
    const chart = await this.page.locator(this.selectors.canvas);
    await expect(chart).toBeTruthy();
    return chart;
  }

  async assertInitialPositionOfChart(containerBox) {
    const initialChartBox = await this.canvasBoundaryBox();
    expect(initialChartBox.x).toBe(containerBox.x);
    expect(initialChartBox.y).toBe(containerBox.y);
  }

  async assertCenteredPositionOfChart(containerBox) {
    const centeredChartBox = await this.canvasBoundaryBox();
    const expectedCenterXPosition = +(containerBox.x || 0) + ((+(containerBox.width || 0) - +(centeredChartBox.width || 0)) / 2);
    const expectedCenterYPosition = +(containerBox.y || 0) + ((+(containerBox.height || 0) - +(centeredChartBox.height || 0)) / 2);
    expect(centeredChartBox.x).toBe(expectedCenterXPosition);
    expect(centeredChartBox.y).toBe(expectedCenterYPosition);
  }

  async assertFitChart(containerBox) {
    const fitChartBox = await this.canvasBoundaryBox();
    expect(fitChartBox.x).toBe(containerBox.x);
    expect(fitChartBox.y).toBe(containerBox.y);
    expect(fitChartBox.width).toBe(containerBox.width);
    expect(fitChartBox.height).toBe(containerBox.height);
  }
}
