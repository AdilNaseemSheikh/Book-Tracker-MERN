import styles from "../loader/loader.module.css";
function Loader() {
  return (
    <div className={styles.bg}>
      <div className={styles.loader}></div>
    </div>
  );
}

export default Loader;
