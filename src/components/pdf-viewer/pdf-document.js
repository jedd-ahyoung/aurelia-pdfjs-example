import {customElement, bindable, inject, bindingMode, TaskQueue} from 'aurelia-framework';
import {PDFJS} from 'pdfjs-dist';

@customElement('pdf-document')
@bindable({ name: 'url' })
@bindable({ name: 'page', defaultValue: 1, defaultBindingMode: bindingMode.twoWay })
@bindable({ name: 'lastpage', defaultValue: 1, defaultBindingMode: bindingMode.twoWay })
@bindable({ name: 'scale', defaultValue: 1, defaultBindingMode: bindingMode.twoWay })
@inject(TaskQueue)
export class PdfDocument {
    constructor (taskQueue) {
        this.taskQueue = taskQueue;
        PDFJS.workerSrc = '/jspm_packages/npm/pdfjs-dist@1.5.391/build/pdf.worker.js';

        var resolveDocumentPending;
        this.documentPending = new Promise(function (resolve, reject) {
            resolveDocumentPending = resolve.bind(this);
        });

        this.pages = [];
        this.scrollTop = {};
        this.offsetTop = {};

        this.currentPage = null;
        this.resolveDocumentPending = resolveDocumentPending;
    }

    attached () {
        return this.documentPending
            .then((pdf) => {
                pdf.cleanupAfterRender = true;
                for (var i = 0; i < pdf.numPages; i++) {
                    this.pages[i] = pdf.getPage(Number(i + 1))
                        .then((page) => {
                            var viewport = page.getViewport(this.scale);
                            var element = document.getElementById('pdfCanvas' + page.pageNumber);

                            this.taskQueue.queueMicroTask(() => {
                                element.height = viewport.height;
                                element.width = viewport.width;
                            });

                            return {
                                element: element,
                                page: page,
                                rendered: false
                            };
                        })
                }

                this.pages.forEach((page) => {
                    page.then((renderObject) => {
                        if (checkIfElementVisible(this.container, renderObject.element))
                        {
                            if (renderObject.rendered) return;
                            render(page, this.scale);
                        }
                    });
                });
            });
    }

    detached () {
        return this.documentPending
            .then((pdf) => {
                pdf.destroy();

                // Destroy PDF worker as well.
            });
    }

    urlChanged (newValue, oldValue) {
        if (newValue === oldValue) return;

        return PDFJS.getDocument(newValue)
            .then((pdf) => {
                this.lastpage = pdf.numPages;
                this.resolveDocumentPending(pdf);
            });
    }

    pageChanged (newValue, oldValue) {
        // if (newValue === oldValue || isNaN(Number(newValue)) || Number(newValue) > this.lastpage || Number(newValue) < 0) {
        //     this.page = oldValue;
        //     return;
        // }
        //
        // return this.documentPending
        //     .then((pdf) => {
        //         return this.pages[newValue]
        //             .then((renderObject) => {
        //                 this.container.scrollTop = renderObject.element.offsetTop;
        //             });
        //     });
    }

    scaleChanged (newValue, oldValue) {
        if (newValue === oldValue || isNaN(Number(newValue))) return;

        Promise.all(this.pages)
            .then((values) => {
                values.forEach((renderObject) => {
                    if (!renderObject) return;

                    var viewport = renderObject.page.getViewport(newValue);

					renderObject.rendered = false;

					this.taskQueue.queueMicroTask(() => {
                        renderObject.element.height = viewport.height;
                        renderObject.element.width = viewport.width;
                    });
                });

                return values;
            })
            .then((values) => {
                this.pages.forEach((page) => {
                    page.then((renderObject) => {
                        if (checkIfElementVisible(this.container, renderObject.element))
                        {
                            if (renderObject.rendered) return;
							this.taskQueue.queueMicroTask(() => {
	                            render(page, this.scale);
							});
                        }
                    });
                });
            });
    }

    scrollHandler () {
        this.pages.forEach((page) => {
            page.then((renderObject) => {
                if ((this.container.scrollTop + this.container.clientHeight) >= renderObject.element.offsetTop
                    && (this.container.scrollTop <= renderObject.element.offsetTop))
                {
                    this.page = renderObject.page.pageNumber;
                }
            });
        });
    }

    renderHandler () {
        Promise.all(this.pages)
            .then((values) => {
                values.forEach((renderObject) => {
                    if (!renderObject) return;

                    if (!checkIfElementVisible(this.container, renderObject.element))
                    {
                        if (renderObject.rendered) {
                            renderObject.page.cleanup();
                        }

                        return;
                    }

                    this.taskQueue.queueMicroTask(() => {
                        if (renderObject.rendered) return;
                        render(renderObject, this.scale);
                    });
                });
            });
    }
}

var checkIfElementVisible = function (container, element) {
    var containerBounds = {
        top: container.scrollTop,
        bottom: container.scrollTop + container.clientHeight
    };

    var elementBounds = {
        top: element.offsetTop,
        bottom: element.offsetTop + element.clientHeight
    };

    return (!((elementBounds.bottom < containerBounds.top && elementBounds.top < containerBounds.top)
        || (elementBounds.top > containerBounds.bottom && elementBounds.bottom > containerBounds.bottom)));
}

var render = function (renderPromise, scale) {
    return Promise.resolve(renderPromise)
        .then((renderObject) => {
            if (renderObject.rendered) return Promise.resolve(renderObject);
            renderObject.rendered = true;

            // console.log("page", renderObject.page);
            var viewport = renderObject.page.getViewport(scale);

            var context = renderObject.element.getContext('2d');

            return renderObject.page.render({
                canvasContext: context,
                viewport: viewport
            })
                .promise.then(() => {
                    return renderObject;
                    // console.log("page", renderObject.page);
                });
    });
};