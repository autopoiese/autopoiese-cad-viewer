import create, { StateCreator } from 'zustand'

type ViewerStore = {
  fit
  switchCameraType: () => void
}

const createViewerStore: StateCreator<ViewerStore> = () => ({})

const viewerStore = create(createViewerStore)

export { viewerStore as useViewer }
