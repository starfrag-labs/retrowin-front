import Image from "next/image";
import styles from "./background.module.css";

export default function Background({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const prefix = process.env.NEXT_PUBLIC_APP_PREFIX ?? "";
  return (
    <div className={styles.container}>
      <Image
        src={`${prefix}/assets/background.webp`}
        alt="background"
        fill
        className={styles.image}
        priority
      />
      {children}
    </div>
  );
}
