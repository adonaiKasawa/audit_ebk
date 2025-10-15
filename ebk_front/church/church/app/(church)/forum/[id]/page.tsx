"use server";

import React from "react";

import ForumDetail from "./page.client";

import { auth } from "@/auth";
import {
  findCommentBySubjectForumApi,
  findForumByIdApi,
} from "@/app/lib/actions/church/church";

export default async function ForumId({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  const forum = await findForumByIdApi(id);
  let comments;

  if (!forum.hasOwnProperty("StatusCode")) {
    if (forum.subjectForum.length > 0) {
      comments = await findCommentBySubjectForumApi(forum.subjectForum[0].id);
      if (comments.hasOwnProperty("StatusCode")) {
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
    } else {
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
