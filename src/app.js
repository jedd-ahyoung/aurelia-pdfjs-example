export class App {
  configureRouter(config, router) {
    config.title = 'Aurelia';
    config.map([
      { route: ['', 'welcome'], name: 'welcome',      moduleId: 'welcome',      nav: true, title: 'Welcome' },
      { route: ['pdfviewer'], name: 'pdfviewer',      moduleId: 'pdfviewer',      nav: true, title: 'PDF Viewer' },
    ]);

    this.router = router;
  }
}
