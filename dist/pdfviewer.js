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

                    this.url = 'dist/documents/oversize_pdf_test_0.pdf';
                    this.pageNumber = 1;
                    this.scale = 1;
                    this.lastpage = 1;
                }

                PdfViewer.prototype.firstPage = function firstPage() {
                    this.pageNumber = 1;
                };

                PdfViewer.prototype.nextPage = function nextPage() {
                    if (this.pageNumber >= this.lastpage) return;

                    this.pageNumber += 1;
                };

                PdfViewer.prototype.prevPage = function prevPage() {
                    if (this.pageNumber <= 1) return;

                    this.pageNumber -= 1;
                };

                PdfViewer.prototype.lastPage = function lastPage() {
                    this.pageNumber = this.lastpage;
                };

                PdfViewer.prototype.goToPage = function goToPage(page) {
                    if (page <= 0 || page > this.lastpage) return;

                    this.pageNumber = page;
                };

                PdfViewer.prototype.zoomIn = function zoomIn() {
                    this.scale += 0.1;
                };

                PdfViewer.prototype.zoomOut = function zoomOut() {
                    this.scale -= 0.1;
                };

                return PdfViewer;
            }());

            _export('PdfViewer', PdfViewer);
        }
    };
});
//# sourceMappingURL=pdfviewer.js.map
