import styles from "./page.module.css";
import Link from "next/link";
import Posts from "./posts";
import { uploadPost } from "./posts";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@auth0/nextjs-auth0";

const sideNavItem = ["My Profile", "Friends", "Groups", "Saved", "Settings"];

export default async function Page({
  searchParams,
}: {
  searchParams: {
    page?: string;
  };
}) {
  const session = await getSession();
  if (session == null || session.user == null) {
    return (
      <div className={styles.loginBtnContainer}>
        <a href="/api/auth/login">Log In</a>
      </div>
    );
  }

  let page = 1;
  if (searchParams.page == null) {
    redirect("/?page=1");
  }

  page = Number.parseInt(searchParams.page);

  return (
    <>
      <nav className={styles.sideNav}>
        <ul>
          {sideNavItem.map((navItemName) => {
            return (
              <li key={`${navItemName.toLowerCase()}Nav`}>
                <Link href="">{navItemName}</Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <main>
        <form className={styles.postStatus} action={uploadPost}>
          <div className="appLogo"></div>
          <textarea
            name="postcontent"
            placeholder="What's on your mind today?"
          ></textarea>
          <div className={styles.postStatusBtns}>
            <button>Cancel</button>
            <input type="submit" value="Post" />
          </div>
        </form>
        <Suspense fallback={"Loading"}>
          <Posts page={page}></Posts>
        </Suspense>
      </main>

      <aside></aside>
    </>
  );
}
