"use server";

import ForumDetail from "./page.client";

import { auth } from "@/auth";
import {
  findForumByIdApi,
  findCommentByForumApi,
} from "@/app/lib/actions/church/church";

export default async function ForumIdClient({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  const forum = await findForumByIdApi(id);

  let comments = null;

  if (forum) {
    const subject = forum.subjectForum?.[0];
    const contentId = subject?.id || forum.id;

    if (contentId) {
      comments = await findCommentByForumApi(contentId);
      
    }
  }

  if (comments?.hasOwnProperty("StatusCode")) {
    comments = {
      items: [],
      meta: {
        totalItems: 0,
        itemCount: 0,
        itemsPerPage: 0,
        totalPages: 0,
        currentPage: 0,
      },
      links: {
        first: "",
        previous: "",
        next: "",
        last: "",
      },
    };
  }

  return (
    <div>
      <ForumDetail
        iniData={{ forum, comments }}
        params={await params}
        session={session}
      />
    </div>
  );
}
