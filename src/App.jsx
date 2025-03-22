import { useEffect, useRef } from "react";
import createImageIdsAndCacheMetaData from "./lib/createImageIdsAndCacheMetaData";
import { RenderingEngine, Enums, volumeLoader, cornerstoneStreamingImageVolumeLoader } from "@cornerstonejs/core";
import { init as csRenderInit } from "@cornerstonejs/core";
import { init as csToolsInit } from "@cornerstonejs/tools";
//import dicomParser from "dicom-parser";
import { init as dicomImageLoaderInit } from "@cornerstonejs/dicom-image-loader";

volumeLoader.registerUnknownVolumeLoader(cornerstoneStreamingImageVolumeLoader);

function App() {
  const elementRef = useRef(null);
  const running = useRef(false);

  useEffect(() => {
    const setup = async () => {
      if (running.current) {
        return;
      }
      running.current = true;

      await csRenderInit();
      await csToolsInit();
      dicomImageLoaderInit({ maxWebWorkers: 1 });

      // Get Cornerstone imageIds and fetch metadata into RAM
      const imageIds = await createImageIdsAndCacheMetaData({
        StudyInstanceUID:
          "1.3.6.1.4.1.14519.5.2.1.7009.2403.334240657131972136850343327463",
        SeriesInstanceUID:
          "1.3.6.1.4.1.14519.5.2.1.7009.2403.226151125820845824875394858561",
        wadoRsRoot: "https://d3t6nz73ql33tx.cloudfront.net/dicomweb",
      });

      // Instantiate a rendering engine
      const renderingEngineId = "myRenderingEngine";
      const renderingEngine = new RenderingEngine(renderingEngineId);
      const viewportId = "CT";

      const viewportInput = {
        viewportId,
        type: Enums.ViewportType.ORTHOGRAPHIC,
        element: elementRef.current,
        defaultOptions: {
          orientation: Enums.OrientationAxis.SAGITTAL,
        },
      };

      renderingEngine.enableElement(viewportInput);

      // Get the stack viewport that was created
      const viewport = renderingEngine.getViewport(viewportId);

      // Define a volume in memory
      const volumeId = "streamingImageVolume";
      const volume = await volumeLoader.createAndCacheVolume(volumeId, {
        imageIds,
      });

      // Set the volume to load
      await volume.load();

      // Set the volume on the viewport and its default properties
      viewport.setVolumes([{ volumeId }]);

      // Render the image
      viewport.render();
    };

    setup();
  }, [elementRef, running]);

  return (
    <div
      ref={elementRef}
      style={{
        width: "512px",
        height: "512px",
        backgroundColor: "#000",
      }}
    ></div>
  );
}

export default App;