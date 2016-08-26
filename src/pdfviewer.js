

export class PdfViewer {
    constructor () {
		this.url = 'dist/documents/oversize_pdf_test_0.pdf';
		this.draftUrl = 'dist/documents/oversize_pdf_test_0.pdf';
        this.pageNumber = 1;
        this.scale = 1;
        this.lastpage = 1;
    }

	loadUrl () {
		this.url = this.draftUrl;
	}

    firstPage () {
        this.pageNumber = 1;
    }

    nextPage () {
        if (this.pageNumber >= this.lastpage) return;

        this.pageNumber += 1;
    }

    prevPage () {
        if (this.pageNumber <= 1) return;

        this.pageNumber -= 1;
    }

    lastPage () {
        this.pageNumber = this.lastpage;
    }

    goToPage (page) {
        if (page <= 0 || page > this.lastpage) return;

        this.pageNumber = page;
    }

    zoomIn () {
        this.scale = Number(this.scale) + 0.1;
    }

    zoomOut () {
        this.scale = Number(this.scale) - 0.1;
    }
}