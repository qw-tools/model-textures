import { TextureEditorSettings } from "../../konva/TextureEditor";
import { QuakeModelViewerSettings } from "../../components/QuakeModelViewer";

export interface EditorAndViewerSettings {
  editor: TextureEditorSettings;
  viewer: QuakeModelViewerSettings;
}
