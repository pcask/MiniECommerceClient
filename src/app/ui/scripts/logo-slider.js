
$(function () {

  let sliderContainerWidth = document.getElementById("brandSliderContainer").clientWidth;
  const draggableElement = document.getElementById("draggable");

  const sliderItemCount = document.getElementsByClassName("brand-slider-item").length;
  const sliderItemWidth = $(document.getElementsByClassName("brand-slider-item")[1]).outerWidth();
  let overflowDistance = (sliderItemCount * sliderItemWidth) - sliderContainerWidth;


  $(window).on("resize", () => {
    sliderContainerWidth = document.getElementById("brandSliderContainer").clientWidth;
    overflowDistance = (sliderItemCount * sliderItemWidth) - sliderContainerWidth;
    draggableElement.style.left = "0px";
    refreshChevron();
  })

  if (overflowDistance > 0) {

    $("#chevronLeft").on("click", () => {
      $(draggableElement).animate({
        left: "0px"
      }, 800, refreshChevron);
    });

    $("#chevronRight").on("click", () => {
      $(draggableElement).animate({
        left: `${(overflowDistance * -1)}px`
      }, 800, refreshChevron);
    });

    $("#chevronRight").css("visibility", "visible");

    //Make the DIV element draggagle:
    dragElement(draggableElement);

    function dragElement(elmnt) {
      var pos1 = 0, pos2 = 0;

      elmnt.onmousedown = dragMouseDown;

      function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos2 = e.clientX;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
      }

      function elementDrag(e) {

        overflowDistance = (sliderItemCount * sliderItemWidth) - sliderContainerWidth;

        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos2 - e.clientX;
        pos2 = e.clientX;

        const elementNewX = elmnt.offsetLeft - pos1;

        if (elementNewX < -1 && elementNewX > ((overflowDistance * -1) + 1)) {
          $("#chevronLeft").css("visibility", "visible");
          $("#chevronRight").css("visibility", "visible");

          elmnt.style.left = elementNewX + "px";
        }
        else if (-1 <= elementNewX && elementNewX <= 0) {
          elmnt.style.left = "0px";
        }
        else if (((overflowDistance * -1) + 1) >= elementNewX && elementNewX >= (overflowDistance * -1)) {
          elmnt.style.left = `${(overflowDistance * -1)}px`;
        }

        refreshChevron();

      }

      function closeDragElement() {
        /* stop moving when mouse button is released:*/
        document.onmouseup = null;
        document.onmousemove = null;
      }
    }
  }


  function refreshChevron() {
    if (draggableElement.style.left == "0px")
      $("#chevronLeft").css("visibility", "hidden");

    if (draggableElement.style.left == `${(overflowDistance * -1)}px`)
      $("#chevronRight").css("visibility", "hidden");

    const leftX = parseInt(draggableElement.style.left.replace("px", ""));
    if (leftX < -1)
      $("#chevronLeft").css("visibility", "visible");
    else if (leftX > (overflowDistance * -1))
      $("#chevronRight").css("visibility", "visible");
  }

});