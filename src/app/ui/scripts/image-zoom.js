

function imageZoom(imgId, lensId, resultId) {

    $(function () {

        var lens, result, cx, cy, prImg = null;
        prImg = document.getElementById(imgId);
        result = document.getElementById(resultId);
        lens = document.getElementById(lensId);

        if (prImg !== undefined && prImg !== null) {

            var imgOrgWidth, imgOrgHeight, imgRenWidth, imgRenHeight;
            imgOrgWidth = prImg.naturalWidth;
            imgOrgHeight = prImg.naturalHeight;
            imgRenWidth = prImg.width;
            imgRenHeight = prImg.height;

            const xRatio = imgOrgWidth / imgRenWidth;
            const yRatio = imgOrgHeight / imgRenHeight;

            // 2 oranının aşağısını zoomlamaya gerek yok
            if (xRatio < 2 || yRatio < 2) {
                result.setAttribute("style", "display: none");
                lens.setAttribute("style", "display: none");
                return;
            }
            else{
                result.setAttribute("style", "display: block");
                lens.setAttribute("style", "display: block");
            }

            lens.setAttribute("style", `width: ${imgRenWidth / xRatio}px; height: ${imgRenHeight / yRatio}px;`);

            /*calculate the ratio between img DIV and lens:*/
            cx = imgRenWidth / lens.offsetWidth;
            cy = imgRenHeight / lens.offsetHeight;

            /*set background properties for the result DIV:*/
            result.style.backgroundImage = "url('" + prImg.src + "')";


            /*execute a function when someone moves the cursor over the image, or the lens:*/
            lens.removeAllListeners();
            prImg.removeAllListeners();
            lens.addEventListener("mousemove", moveLens);
            prImg.addEventListener("mousemove", moveLens);
            lens.addEventListener("mouseenter", inZoomMod);
            prImg.addEventListener("mouseenter", inZoomMod);

            lens.addEventListener("mouseout", outZoomMod);
            prImg.addEventListener("mouseout", outZoomMod);
            /*and also for touch screens:*/
            // lens.addEventListener("touchmove", moveLens);
            // prImg.addEventListener("touchmove", moveLens);

            function inZoomMod(){
                lens.classList.add('active');
                result.classList.add('active');
            }
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
                if (x > prImg.width - lens.offsetWidth) { x = prImg.width - lens.offsetWidth; }
                if (x < 0) { x = 0; }
                if (y > prImg.height - lens.offsetHeight) { y = prImg.height - lens.offsetHeight; }
                if (y < 0) { y = 0; }
                /*set the position of the lens:*/
                lens.style.left = x + "px";
                lens.style.top = y + "px";
                /*display what the lens "sees":*/

                result.style.backgroundSize = imgOrgWidth + "px " + imgOrgHeight + "px";
                result.style.backgroundPosition = "-" + (x * cx) + "px -" + ((y * cy) <= 1153.3 ? (y * cy) : 1153.3) + "px";

                
            }
            function getCursorPos(e) {
                var a, x = 0, y = 0;
                e = e || window.event;
                /*get the x and y positions of the image:*/
                a = prImg.getBoundingClientRect();
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

        }
    });
}