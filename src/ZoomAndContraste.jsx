import React, { useEffect, useRef } from "react";
import { init as coreInit, RenderingEngine, Enums } from "@cornerstonejs/core";
import { init as dicomImageLoaderInit } from "@cornerstonejs/dicom-image-loader";
import {
  init as cornerstoneToolsInit,
  ToolGroupManager,
  WindowLevelTool,
  ZoomTool,
  Enums as csToolsEnums,
  addTool,
} from "@cornerstonejs/tools";
import createImageIdsAndCacheMetaData from "./lib/createImageIdsAndCacheMetaData";

const { ViewportType } = Enums;

const CornerstoneViewer = () => {
  const viewerRef = useRef(null);

  useEffect(() => {
    const run = async () => {
      await coreInit();

      // ✅ Verifica si ya está inicializado antes de llamar dicomImageLoaderInit
      if (!window.dicomImageLoaderInitialized) {
        await dicomImageLoaderInit();
        window.dicomImageLoaderInitialized = true;
      }

      await cornerstoneToolsInit();

      const imageIds = await createImageIdsAndCacheMetaData({
        StudyInstanceUID:
          "1.3.6.1.4.1.14519.5.2.1.7009.2403.334240657131972136850343327463",
        SeriesInstanceUID:
          "1.3.6.1.4.1.14519.5.2.1.7009.2403.226151125820845824875394858561",
        wadoRsRoot: "https://d14fa38qiwhyfd.cloudfront.net/dicomweb",
      });

      const renderingEngineId = "myRenderingEngine";
      const renderingEngine = new RenderingEngine(renderingEngineId);

      const viewportId = "CT_AXIAL_STACK";

      const viewportInput = {
        viewportId,
        element: viewerRef.current,
        type: ViewportType.STACK,
      };

      renderingEngine.enableElement(viewportInput);

      const viewport = renderingEngine.getViewport(viewportId);
      viewport.setStack(imageIds);
      viewport.render();

      const toolGroupId = "myToolGroup";

      // ✅ Verifica si ya existe antes de crear un nuevo ToolGroup
      let toolGroup = ToolGroupManager.getToolGroup(toolGroupId);
      if (!toolGroup) {
        toolGroup = ToolGroupManager.createToolGroup(toolGroupId);
      }

      // ✅ Verifica si addTool está disponible antes de llamarlo
      if (typeof addTool === "function") {
        addTool(ZoomTool);
        addTool(WindowLevelTool);
      }

      if (toolGroup) {
        toolGroup.addTool(ZoomTool.toolName);
        toolGroup.addTool(WindowLevelTool.toolName);
        toolGroup.addViewport(viewportId);

        toolGroup.setToolActive(WindowLevelTool.toolName, {
          bindings: [
            {
              mouseButton: csToolsEnums.MouseBindings.Primary, // Left Click
            },
          ],
        });

        toolGroup.setToolActive(ZoomTool.toolName, {
          bindings: [
            {
              mouseButton: csToolsEnums.MouseBindings.Secondary, // Right Click
            },
          ],
        });
      }

      viewport.render();
    };

    run();
  }, []);

  return <div ref={viewerRef} style={{ width: "500px", height: "500px" }} />;
};

export default CornerstoneViewer;
