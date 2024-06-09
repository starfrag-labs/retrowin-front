import { elementsContainer } from "../css/styles/element.css";
import { IElement } from "../types/element";
import { Element } from "./Element";

export const Elements = ({ elements, folderKey }: { elements: IElement[], folderKey: string }): React.ReactElement => {
  const uploadFileHandler = () => {
    console.log('upload file');
  }

  const uploadFileElement: IElement = {
    key: 'upload-file',
    name: 'upload',
    type: 'uploadFile',
    parentKey: folderKey,
    selected: false,
  }

  return (
    <div className={elementsContainer}>
      <Element element={uploadFileElement} uploadFileHandler={uploadFileHandler} />
      {elements.map((element) => (
        <Element key={element.key} element={element} />
      ))}
    </div>
  );
}