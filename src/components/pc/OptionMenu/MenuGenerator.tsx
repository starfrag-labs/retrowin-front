import { menuElement, menuElementContainer, menuSplit } from "../../../styles/pc/menu.css";

export const MenuGenerator = ({ menuList }: {
  menuList: {
    name: string;
    action: () => void;
  }[];
}) => {
  return (
    <div>
      {menuList.map(({name, action}, index) => (
        <div className={menuElementContainer} key={index}>
          {name === '/' ? (
            <div className={menuSplit} />
          ) : (
            <div className={menuElement} onClick={() => action()}>
              {name}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}