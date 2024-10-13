import FileContainer from "@/components/file/file_container";
import styles from "./page.module.css";
import Background from "@/components/layout/background";
import Navbar from "@/components/layout/navbar/navbar_container";

export default function Home() {
  return (
    <div className={styles.page}>
      <Background>
        <FileContainer />
      </Background>
      <Navbar />
    </div>
  );
}
