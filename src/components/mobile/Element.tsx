export const Element = ({ elementKey, name, type }: {
  elementKey: string;
  name: string;
  type: string;
}) => {
  return (
    <div>
      {type === 'folder' ? (
        <div>
          folder
        </div>
      ) : (
        <div>
          file
        </div>
      )}
    </div>
  );
};