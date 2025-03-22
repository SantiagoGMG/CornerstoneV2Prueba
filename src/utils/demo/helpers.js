export async function createImageIdsAndCacheMetaData({ StudyInstanceUID, SeriesInstanceUID, wadoRsRoot }) {
    const studyImageIds = await fetch(`${wadoRsRoot}/studies/${StudyInstanceUID}/series/${SeriesInstanceUID}/instances`)
      .then(response => response.json())
      .then(instances => instances.map(instance => `${wadoRsRoot}/studies/${StudyInstanceUID}/series/${SeriesInstanceUID}/instances/${instance.SOPInstanceUID}/frames/1`));
  
    return studyImageIds;
  }