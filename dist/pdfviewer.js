'use strict';

System.register([], function (_export, _context) {
    "use strict";

    var PdfViewer;

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    return {
        setters: [],
        execute: function () {
            _export('PdfViewer', PdfViewer = function () {
                function PdfViewer() {
                    _classCallCheck(this, PdfViewer);

                    this.documents = [{
                        url: 'dist/documents/oversize_pdf_test_0.pdf',
                        draftUrl: 'dist/documents/oversize_pdf_test_0.pdf',
                        pageNumber: 1,
                        scale: 1,
                        lastpage: 1
                    }, {
                        url: 'dist/documents/pdf.pdf',
                        draftUrl: 'dist/documents/pdf.pdf',
                        pageNumber: 1,
                        scale: 1,
                        lastpage: 1
                    }];
                }

                PdfViewer.prototype.loadUrl = function loadUrl(document) {
                    document.url = document.draftUrl;
                };

                PdfViewer.prototype.firstPage = function firstPage(document) {
                    document.pageNumber = 1;
                };

                PdfViewer.prototype.nextPage = function nextPage(document) {
                    if (document.pageNumber >= document.lastpage) return;

                    document.pageNumber += 1;
                };

                PdfViewer.prototype.prevPage = function prevPage(document) {
                    if (document.pageNumber <= 1) return;

                    document.pageNumber -= 1;
                };

                PdfViewer.prototype.lastPage = function lastPage(document) {
                    document.pageNumber = document.lastpage;
                };

                PdfViewer.prototype.goToPage = function goToPage(document, page) {
                    if (page <= 0 || page > document.lastpage) return;

                    document.pageNumber = page;
                };

                PdfViewer.prototype.zoomIn = function zoomIn(document) {
                    document.scale = Number(document.scale) + 0.1;
                };

                PdfViewer.prototype.zoomOut = function zoomOut(document) {
                    document.scale = Number(document.scale) - 0.1;
                };

                return PdfViewer;
            }());

            _export('PdfViewer', PdfViewer);
        }
    };
});
//# sourceMappingURL=pdfviewer.js.map
