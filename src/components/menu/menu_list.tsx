import styles from "./menu_list.module.css";
export default function MenuList({
  menuList,
}: {
  menuList: { name: string; action: () => void }[];
}) {
  return (
    <div className={`${styles.container}`}>
      {menuList.map(({ name, action }, index) => (
        <div className={`${styles.list_item_container}`} key={index}>
          {name === "/" ? (
            <div className={styles.list_split} />
          ) : (
            <div className={styles.list_item} onClick={() => action()}>
              {name}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
