function newImage() {
    console.log("test");
    var images = document.getElementsByClassName("flip-image");
    for (var i = 0; i < images.length; i++) {
      if (images[i].className.match("active")) {
        images[i].classList.remove("active");
        if (i >= images.length - 1) {
          images[0].classList.add("active");
        } else {
          images[i + 1].classList.add("active");
        }
        break;
      }
    }
  }

  setInterval(newImage, 2000);