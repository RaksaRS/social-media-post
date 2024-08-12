import styles from "@/app/profile/[id]/page.module.css";

export default async function Page({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const { id } = params;
  return (
    <>
      <h3 className={styles.redText}>ID: {id}</h3>
      <h3>Thomas Frank</h3>
      <h3>Age: 23 years old</h3>
      <h3>Birthdate: 6/12/86</h3>
    </>
  );
}
