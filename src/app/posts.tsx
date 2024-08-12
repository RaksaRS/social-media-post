import styles from "./posts.module.css";
import Link from "next/link";
import { getSession } from "@auth0/nextjs-auth0";
import prisma from "../../prisma/db";

const postsPerPage = 20;

export interface User {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  gender: string;
  joineddate: Date;
}

export interface Post {
  id: number;
  userid: number;
  postcontent: string;
  postdate: Date;
  likes: number;
}

export interface PostXUser extends Post {
  user: User;
}

export async function fetchPosts(limit: number, offset?: number) {
  if (offset == null) offset = 1;
  const postIds: Array<number> = [];
  for (let i = offset; i < offset + limit; i++) {
    postIds.push(i);
  }

  return await prisma.post.findMany({
    where: {
      id: {
        in: postIds,
      },
    },
    include: {
      user: true,
    },
  });
}

export async function uploadPost(formData: FormData) {
  "use server";
  console.log("Server action running");
  const session = await getSession();
  const userid = session?.user.sub;
  const postcontent = formData.get("postcontent") as string;
  const postDate = new Date(Date.now());
  await prisma.post.create({
    data: {
      userid: userid,
      postcontent: postcontent,
      postdate: postDate,
      likes: 0,
    },
  });
}

export default async function Posts({ page }: { page: number }) {
  const posts: Array<PostXUser> = await fetchPosts(
    postsPerPage,
    (page - 1) * postsPerPage + 1
  );

  return (
    <div className={styles.posts}>
      <ul className={styles.postsList}>
        {posts.map((post) => {
          return (
            <li key={post.id} className={styles.post}>
              <div className={styles.userProfile}>
                <div className={styles.userPhoto}></div>
                <div>
                  <h6 className={styles.username}>
                    {post.user.firstname} {post.user.lastname}
                  </h6>
                  <small>{post.postdate.toString()}</small>
                </div>
              </div>
              <p className={styles.postContent}>{post.postcontent}</p>
              <div className={styles.stats}>
                <button>👍 {post.likes}</button>
              </div>
            </li>
          );
        })}
      </ul>
      <div className={styles.pagination}>
        <Link className={styles.prevBtn} href={`/?page=${page - 1}`}>
          &lt;
        </Link>
        <p> Page {page} </p>
        <Link className={styles.nextBtn} href={`/?page=${page + 1}`}>
          &gt;
        </Link>
      </div>
    </div>
  );
}
