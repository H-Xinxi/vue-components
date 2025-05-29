import { domToCanvas } from "modern-screenshot";
import { reactive } from "vue";

export const screenShot = async () => {
  const clipZone = reactive({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  domToCanvas(document.querySelector("#app")!, {
    features: {
      restoreScrollPosition: true,
    },
  }).then((canvas) => {
    const imageData = canvas
      .getContext("2d")
      ?.getImageData(clipZone.x, clipZone.y, clipZone.width, clipZone.height);
    if(!imageData) return
    const clipedCanvas = document.createElement("canvas");
    clipedCanvas.getContext("2d")?.putImageData(imageData, 0, 0);
    const dataUrl = clipedCanvas.toDataURL()

    const link = document.createElement("a");
    link.download = "screenshot.png";
    link.href = dataUrl;
    link.click();
  });

  const screenShot = () => {
    document.addEventListener('pointerdown', () => {
      
    })
  }
  return {

  }
};
