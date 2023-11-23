const { test } = require('@playwright/test');
const { WebstudioPage } = require('../pages/webstudio');

test('Draw chart test', async ({ page }) => {
  const webstudioPage = new WebstudioPage(page);
  await webstudioPage.visit();
  await webstudioPage.skipTour();

  await webstudioPage.dropArtboard();
  const containerBox = await webstudioPage.containerBoundaryBox();

  await webstudioPage.dropChart();
  await webstudioPage.assertCanvas();
  await webstudioPage.assertInitialPositionOfChart(containerBox);

  await webstudioPage.centerizeCanvas();
  await webstudioPage.assertCenteredPositionOfChart(containerBox);

  await webstudioPage.fitCanvas();
  await webstudioPage.assertFitChart(containerBox);
});
