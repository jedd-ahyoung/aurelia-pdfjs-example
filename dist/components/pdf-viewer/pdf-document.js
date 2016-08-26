'use strict';

System.register(['aurelia-framework', 'pdfjs-dist', 'aurelia-templating-binding'], function (_export, _context) {
    "use strict";

    var customElement, bindable, inject, bindingMode, TaskQueue, PDFJS, SyntaxInterpreter, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _class, PdfDocument, checkIfElementVisible, render;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    return {
        setters: [function (_aureliaFramework) {
            customElement = _aureliaFramework.customElement;
            bindable = _aureliaFramework.bindable;
            inject = _aureliaFramework.inject;
            bindingMode = _aureliaFramework.bindingMode;
            TaskQueue = _aureliaFramework.TaskQueue;
        }, function (_pdfjsDist) {
            PDFJS = _pdfjsDist.PDFJS;
        }, function (_aureliaTemplatingBinding) {
            SyntaxInterpreter = _aureliaTemplatingBinding.SyntaxInterpreter;
        }],
        execute: function () {
            SyntaxInterpreter.prototype.trigger2 = SyntaxInterpreter.prototype.trigger;

            _export('PdfDocument', PdfDocument = (_dec = customElement('pdf-document'), _dec2 = bindable({ name: 'url' }), _dec3 = bindable({ name: 'page', defaultValue: 1, defaultBindingMode: bindingMode.twoWay }), _dec4 = bindable({ name: 'lastpage', defaultValue: 1, defaultBindingMode: bindingMode.twoWay }), _dec5 = bindable({ name: 'scale', defaultValue: 1, defaultBindingMode: bindingMode.twoWay }), _dec6 = inject(TaskQueue), _dec(_class = _dec2(_class = _dec3(_class = _dec4(_class = _dec5(_class = _dec6(_class = function () {
                function PdfDocument(taskQueue) {
                    _classCallCheck(this, PdfDocument);

                    this.taskQueue = taskQueue;
                    PDFJS.workerSrc = 'jspm_packages/npm/pdfjs-dist@1.5.391/build/pdf.worker.js';

                    this.pages = [];
                    this.scrollTop = {};
                    this.offsetTop = {};

                    this.currentPage = null;
                    this.resolveDocumentPending;
                }

                PdfDocument.prototype.detached = function detached() {
                    return this.documentPending.then(function (pdf) {
                        pdf.destroy();
                    });
                };

                PdfDocument.prototype.urlChanged = function urlChanged(newValue, oldValue) {
                    var _this = this;

                    if (newValue === oldValue) return;

                    var promise = this.documentPending || Promise.resolve();
                    this.documentPending = new Promise(function (resolve, reject) {
                        _this.resolveDocumentPending = resolve.bind(_this);
                    });

                    return promise.then(function (pdf) {
                        if (pdf) {
                            pdf.destroy();
                        }
                        return PDFJS.getDocument(newValue);
                    }).then(function (pdf) {
                        _this.lastpage = pdf.numPages;

                        pdf.cleanupAfterRender = true;
                        for (var i = 0; i < pdf.numPages; i++) {
                            _this.pages[i] = pdf.getPage(Number(i + 1)).then(function (page) {
                                var viewport = page.getViewport(_this.scale);
                                var element = document.getElementById('pdfCanvas' + page.pageNumber);

                                _this.taskQueue.queueMicroTask(function () {
                                    element.height = viewport.height;
                                    element.width = viewport.width;
                                });

                                return {
                                    element: element,
                                    page: page,
                                    rendered: false,
                                    clean: false
                                };
                            });
                        }

                        _this.pages.forEach(function (page) {
                            page.then(function (renderObject) {
                                if (checkIfElementVisible(_this.container, renderObject.element)) {
                                    if (renderObject.rendered) return;
                                    render(page, _this.scale);
                                }
                            });
                        });

                        _this.resolveDocumentPending(pdf);
                    });
                };

                PdfDocument.prototype.pageChanged = function pageChanged(newValue, oldValue) {
                    var _this2 = this;

                    if (newValue === oldValue || isNaN(Number(newValue)) || Number(newValue) > this.lastpage || Number(newValue) < 0) {
                        this.page = oldValue;
                        return;
                    }

                    console.log("threshold", Math.abs(newValue - oldValue));
                    if (Math.abs(newValue - oldValue) <= 1) return;

                    this.pages[newValue - 1].then(function (renderObject) {
                        _this2.container.scrollTop = renderObject.element.offsetTop;
                        render(_this2.pages[newValue - 1], _this2.scale);
                    });
                };

                PdfDocument.prototype.scaleChanged = function scaleChanged(newValue, oldValue) {
                    var _this3 = this;

                    if (newValue === oldValue || isNaN(Number(newValue))) return;

                    Promise.all(this.pages).then(function (values) {
                        values.forEach(function (renderObject) {
                            if (!renderObject) return;

                            var viewport = renderObject.page.getViewport(newValue);

                            renderObject.rendered = false;

                            _this3.taskQueue.queueMicroTask(function () {
                                renderObject.element.height = viewport.height;
                                renderObject.element.width = viewport.width;

                                if (renderObject.page.pageNumber === _this3.page) {
                                    _this3.container.scrollTop = renderObject.element.offsetTop;
                                }
                            });
                        });

                        return values;
                    }).then(function (values) {
                        _this3.pages.forEach(function (page) {
                            page.then(function (renderObject) {
                                _this3.taskQueue.queueMicroTask(function () {
                                    if (checkIfElementVisible(_this3.container, renderObject.element)) {
                                        render(page, _this3.scale);
                                    }
                                });
                            });
                        });
                    });
                };

                PdfDocument.prototype.pageHandler = function pageHandler() {
                    var _this4 = this;

                    this.pages.forEach(function (page) {
                        page.then(function (renderObject) {
                            if (_this4.container.scrollTop + _this4.container.clientHeight >= renderObject.element.offsetTop && _this4.container.scrollTop <= renderObject.element.offsetTop) {
                                _this4.page = renderObject.page.pageNumber;
                            }
                        });
                    });
                };

                PdfDocument.prototype.renderHandler = function renderHandler() {
                    var _this5 = this;

                    Promise.all(this.pages).then(function (values) {
                        values.forEach(function (renderObject) {
                            if (!renderObject) return;

                            if (!checkIfElementVisible(_this5.container, renderObject.element)) {
                                if (renderObject.rendered && renderObject.clean) {
                                    renderObject.page.cleanup();
                                    renderObject.clean = true;
                                }

                                return;
                            }

                            _this5.taskQueue.queueMicroTask(function () {
                                if (renderObject.rendered) return;
                                render(renderObject, _this5.scale);
                            });
                        });
                    });
                };

                return PdfDocument;
            }()) || _class) || _class) || _class) || _class) || _class) || _class));

            _export('PdfDocument', PdfDocument);

            checkIfElementVisible = function checkIfElementVisible(container, element) {
                var containerBounds = {
                    top: container.scrollTop,
                    bottom: container.scrollTop + container.clientHeight
                };

                var elementBounds = {
                    top: element.offsetTop,
                    bottom: element.offsetTop + element.clientHeight
                };

                return !(elementBounds.bottom < containerBounds.top && elementBounds.top < containerBounds.top || elementBounds.top > containerBounds.bottom && elementBounds.bottom > containerBounds.bottom);
            };

            render = function render(renderPromise, scale) {
                return Promise.resolve(renderPromise).then(function (renderObject) {
                    if (renderObject.rendered) return Promise.resolve(renderObject);
                    renderObject.rendered = true;

                    var viewport = renderObject.page.getViewport(scale);

                    var context = renderObject.element.getContext('2d');

                    return renderObject.page.render({
                        canvasContext: context,
                        viewport: viewport
                    }).promise.then(function () {
                        return renderObject;
                    });
                });
            };
        }
    };
});
//# sourceMappingURL=pdf-document.js.map
