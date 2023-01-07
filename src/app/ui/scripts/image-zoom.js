

function imageZoom(imgId, lensId, resultId) {

    $(function () {

        var img, lens, result, cx, cy;
        img = document.getElementById(imgId);
        result = document.getElementById(resultId);
        lens = document.getElementById(lensId);

        var imgOrgWidth, imgOrgHeight, imgRenWidth, imgRenHeight;
        imgOrgWidth = img.naturalWidth;
        imgOrgHeight = img.naturalHeight;
        imgRenWidth = img.width;
        imgRenHeight = img.height;

        const xRatio = imgOrgWidth / imgRenWidth;
        const yRatio = imgOrgHeight / imgRenHeight;

        // 2 oranın aşağısını zoomlamaya gerek yok
        if (xRatio < 2 || yRatio < 2)
            return;

        lens.setAttribute("style", `width: ${imgRenWidth / xRatio}px; height: ${imgRenHeight / yRatio}px;`);

        /*calculate the ratio between img DIV and lens:*/
        cx = imgRenWidth / lens.offsetWidth;
        cy = imgRenHeight / lens.offsetHeight;

        /*set background properties for the result DIV:*/
        result.style.backgroundImage = "url('" + img.src + "')";


        /*execute a function when someone moves the cursor over the image, or the lens:*/
        lens.addEventListener("mousemove", moveLens);
        img.addEventListener("mousemove", moveLens);
        lens.addEventListener("mouseout", outZoomMod);
        img.addEventListener("mouseout", outZoomMod);
        /*and also for touch screens:*/
        lens.addEventListener("touchmove", moveLens);
        img.addEventListener("touchmove", moveLens);
        function moveLens(e) {
            var pos, x, y;
            /*prevent any other actions that may occur when moving over the image:*/
            e.preventDefault();
            /*get the cursor's x and y positions:*/
            pos = getCursorPos(e);
            /*calculate the position of the lens:*/
            x = pos.x - (lens.offsetWidth / 2);
            y = pos.y - (lens.offsetHeight / 2);

            /*prevent the lens from being positioned outside the image:*/
            if (x > img.width - lens.offsetWidth) { x = img.width - lens.offsetWidth; }
            if (x < 0) { x = 0; }
            if (y > img.height - lens.offsetHeight) { y = img.height - lens.offsetHeight; }
            if (y < 0) { y = 0; }
            /*set the position of the lens:*/
            lens.style.left = x + "px";
            lens.style.top = y + "px";
            /*display what the lens "sees":*/

            result.style.backgroundSize = imgOrgWidth + "px " + imgOrgHeight + "px";
            result.style.backgroundPosition = "-" + (x * cx) + "px -" + ((y * cy) <= 1153.3 ? (y * cy) : 1153.3) + "px";

            lens.classList.add('active');
            result.classList.add('active');
        }
        function getCursorPos(e) {
            var a, x = 0, y = 0;
            e = e || window.event;
            /*get the x and y positions of the image:*/
            a = img.getBoundingClientRect();
            /*calculate the cursor's x and y coordinates, relative to the image:*/
            x = e.pageX - a.left;
            y = e.pageY - a.top;
            /*consider any page scrolling:*/
            x = x - window.pageXOffset;
            y = y - window.pageYOffset;
            return { x: x, y: y };
        }
        function outZoomMod() {
            lens.classList.remove('active');
            result.classList.remove('active');
        }
    });
}