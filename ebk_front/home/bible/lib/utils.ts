import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const bibleBookData = [
  {
    code: "ge",
    name: "Genèse",
    old: true,
    chapter: 50,
    verset: [
      31, // Chapitre 1
      25, // Chapitre 2
      24, // Chapitre 3
      26, // Chapitre 4
      32, // Chapitre 5
      22, // Chapitre 6
      24, // Chapitre 7
      22, // Chapitre 8
      29, // Chapitre 9
      32, // Chapitre 10
      32, // Chapitre 11
      20, // Chapitre 12
      18, // Chapitre 13
      24, // Chapitre 14
      21, // Chapitre 15
      16, // Chapitre 16
      27, // Chapitre 17
      33, // Chapitre 18
      38, // Chapitre 19
      18, // Chapitre 20
      34, // Chapitre 21
      24, // Chapitre 22
      20, // Chapitre 23
      67, // Chapitre 24
      34, // Chapitre 25
      35, // Chapitre 26
      46, // Chapitre 27
      22, // Chapitre 28
      35, // Chapitre 29
      43, // Chapitre 30
      55, // Chapitre 31
      32, // Chapitre 32
      20, // Chapitre 33
      31, // Chapitre 34
      29, // Chapitre 35
      43, // Chapitre 36
      36, // Chapitre 37
      30, // Chapitre 38
      23, // Chapitre 39
      23, // Chapitre 40
      57, // Chapitre 41
      38, // Chapitre 42
      34, // Chapitre 43
      34, // Chapitre 44
      28, // Chapitre 45
      34, // Chapitre 46
      31, // Chapitre 47
      22, // Chapitre 48
      33, // Chapitre 49
      26, // Chapitre 50
    ],
  },
  {
    code: "exo",
    name: "Exode",
    old: true,
    chapter: 40,
    verset: [
      22, // Chapitre 1
      25, // Chapitre 2
      22, // Chapitre 3
      31, // Chapitre 4
      23, // Chapitre 5
      30, // Chapitre 6
      25, // Chapitre 7
      32, // Chapitre 8
      35, // Chapitre 9
      29, // Chapitre 10
      10, // Chapitre 11
      51, // Chapitre 12
      22, // Chapitre 13
      31, // Chapitre 14
      27, // Chapitre 15
      36, // Chapitre 16
      16, // Chapitre 17
      27, // Chapitre 18
      25, // Chapitre 19
      26, // Chapitre 20
      36, // Chapitre 21
      31, // Chapitre 22
      33, // Chapitre 23
      18, // Chapitre 24
      40, // Chapitre 25
      37, // Chapitre 26
      21, // Chapitre 27
      43, // Chapitre 28
      46, // Chapitre 29
      38, // Chapitre 30
      18, // Chapitre 31
      35, // Chapitre 32
      23, // Chapitre 33
      35, // Chapitre 34
      35, // Chapitre 35
      38, // Chapitre 36
      29, // Chapitre 37
      31, // Chapitre 38
      43, // Chapitre 39
      38, // Chapitre 40
    ],
  },
  {
    code: "lev",
    name: "Lévitique",
    old: true,
    chapter: 27,
    verset: [
      17, // Chapitre 1
      16, // Chapitre 2
      17, // Chapitre 3
      35, // Chapitre 4
      19, // Chapitre 5
      30, // Chapitre 6
      38, // Chapitre 7
      36, // Chapitre 8
      24, // Chapitre 9
      20, // Chapitre 10
      47, // Chapitre 11
      8, // Chapitre 12
      59, // Chapitre 13
      57, // Chapitre 14
      33, // Chapitre 15
      34, // Chapitre 16
      16, // Chapitre 17
      30, // Chapitre 18
      37, // Chapitre 19
      27, // Chapitre 20
      24, // Chapitre 21
      33, // Chapitre 22
      44, // Chapitre 23
      23, // Chapitre 24
      55, // Chapitre 25
      46, // Chapitre 26
      34, // Chapitre 27
    ],
  },
  {
    code: "num",
    name: "Nombres",
    old: true,
    chapter: 36,
    verset: [
      54, // Chapitre 1
      34, // Chapitre 2
      51, // Chapitre 3
      49, // Chapitre 4
      31, // Chapitre 5
      27, // Chapitre 6
      89, // Chapitre 7
      26, // Chapitre 8
      23, // Chapitre 9
      36, // Chapitre 10
      35, // Chapitre 11
      16, // Chapitre 12
      33, // Chapitre 13
      45, // Chapitre 14
      41, // Chapitre 15
      50, // Chapitre 16
      13, // Chapitre 17
      32, // Chapitre 18
      22, // Chapitre 19
      29, // Chapitre 20
      35, // Chapitre 21
      41, // Chapitre 22
      30, // Chapitre 23
      25, // Chapitre 24
      18, // Chapitre 25
      65, // Chapitre 26
      23, // Chapitre 27
      31, // Chapitre 28
      40, // Chapitre 29
      16, // Chapitre 30
      54, // Chapitre 31
      42, // Chapitre 32
      56, // Chapitre 33
      29, // Chapitre 34
      34, // Chapitre 35
      13, // Chapitre 36
    ],
  },
  {
    code: "deu",
    name: "Deutéronome",
    old: true,
    chapter: 34,
    verset: [
      46, // Chapitre 1
      37, // Chapitre 2
      29, // Chapitre 3
      49, // Chapitre 4
      33, // Chapitre 5
      25, // Chapitre 6
      26, // Chapitre 7
      20, // Chapitre 8
      29, // Chapitre 9
      22, // Chapitre 10
      32, // Chapitre 11
      32, // Chapitre 12
      18, // Chapitre 13
      29, // Chapitre 14
      23, // Chapitre 15
      22, // Chapitre 16
      20, // Chapitre 17
      22, // Chapitre 18
      21, // Chapitre 19
      20, // Chapitre 20
      23, // Chapitre 21
      30, // Chapitre 22
      25, // Chapitre 23
      22, // Chapitre 24
      19, // Chapitre 25
      19, // Chapitre 26
      68, // Chapitre 27
      29, // Chapitre 28
      69, // Chapitre 29
      20, // Chapitre 30
      30, // Chapitre 31
      52, // Chapitre 32
      29, // Chapitre 33
      12, // Chapitre 34
    ],
  },
  {
    code: "josh",
    name: "Josué",
    old: true,
    chapter: 24,
    verset: [
      18, // Chapitre 1
      24, // Chapitre 2
      17, // Chapitre 3
      24, // Chapitre 4
      15, // Chapitre 5
      27, // Chapitre 6
      26, // Chapitre 7
      35, // Chapitre 8
      27, // Chapitre 9
      43, // Chapitre 10
      23, // Chapitre 11
      24, // Chapitre 12
      33, // Chapitre 13
      15, // Chapitre 14
      63, // Chapitre 15
      10, // Chapitre 16
      18, // Chapitre 17
      28, // Chapitre 18
      51, // Chapitre 19
      9, // Chapitre 20
      45, // Chapitre 21
      34, // Chapitre 22
      16, // Chapitre 23
      33, // Chapitre 24
    ],
  },
  {
    code: "jdgs",
    name: "Juges",
    old: true,
    chapter: 21,
    verset: [
      36, // Chapitre 1
      23, // Chapitre 2
      31, // Chapitre 3
      24, // Chapitre 4
      31, // Chapitre 5
      40, // Chapitre 6
      25, // Chapitre 7
      35, // Chapitre 8
      57, // Chapitre 9
      18, // Chapitre 10
      40, // Chapitre 11
      15, // Chapitre 12
      25, // Chapitre 13
      20, // Chapitre 14
      20, // Chapitre 15
      31, // Chapitre 16
      13, // Chapitre 17
      31, // Chapitre 18
      30, // Chapitre 19
      48, // Chapitre 20
      25, // Chapitre 21
    ],
  },
  {
    code: "ruth",
    name: "Ruth",
    old: true,
    chapter: 4,
    verset: [
      22, // Chapitre 1
      23, // Chapitre 2
      18, // Chapitre 3
      22, // Chapitre 4
    ],
  },
  {
    code: "1sm",
    name: "1 Samuel",
    old: true,
    chapter: 31,
    verset: [
      28, // Chapitre 1
      36, // Chapitre 2
      21, // Chapitre 3
      22, // Chapitre 4
      12, // Chapitre 5
      21, // Chapitre 6
      17, // Chapitre 7
      22, // Chapitre 8
      27, // Chapitre 9
      27, // Chapitre 10
      15, // Chapitre 11
      25, // Chapitre 12
      23, // Chapitre 13
      52, // Chapitre 14
      35, // Chapitre 15
      23, // Chapitre 16
      58, // Chapitre 17
      30, // Chapitre 18
      24, // Chapitre 19
      42, // Chapitre 20
      15, // Chapitre 21
      23, // Chapitre 22
      29, // Chapitre 23
      22, // Chapitre 24
      44, // Chapitre 25
      25, // Chapitre 26
      12, // Chapitre 27
      25, // Chapitre 28
      11, // Chapitre 29
      31, // Chapitre 30
      13, // Chapitre 31
    ],
  },
  {
    code: "2sm",
    name: "2 Samuel",
    old: true,
    chapter: 24,
    verset: [
      27, // Chapitre 1
      32, // Chapitre 2
      39, // Chapitre 3
      12, // Chapitre 4
      25, // Chapitre 5
      23, // Chapitre 6
      29, // Chapitre 7
      18, // Chapitre 8
      13, // Chapitre 9
      19, // Chapitre 10
      27, // Chapitre 11
      31, // Chapitre 12
      39, // Chapitre 13
      33, // Chapitre 14
      37, // Chapitre 15
      23, // Chapitre 16
      29, // Chapitre 17
      33, // Chapitre 18
      43, // Chapitre 19
      26, // Chapitre 20
      22, // Chapitre 21
      51, // Chapitre 22
      39, // Chapitre 23
      25, // Chapitre 24
    ],
  },
  {
    code: "1ki",
    name: "1 Rois",
    old: true,
    chapter: 22,
    verset: [
      53, // Chapitre 1
      46, // Chapitre 2
      28, // Chapitre 3
      34, // Chapitre 4
      32, // Chapitre 5
      38, // Chapitre 6
      51, // Chapitre 7
      66, // Chapitre 8
      28, // Chapitre 9
      29, // Chapitre 10
      43, // Chapitre 11
      33, // Chapitre 12
      34, // Chapitre 13
      31, // Chapitre 14
      34, // Chapitre 15
      34, // Chapitre 16
      24, // Chapitre 17
      46, // Chapitre 18
      21, // Chapitre 19
      43, // Chapitre 20
      29, // Chapitre 21
      53, // Chapitre 22
    ],
  },
  {
    code: "2ki",
    name: "2 Rois",
    old: true,
    chapter: 25,
    verset: [
      18, // Chapitre 1
      25, // Chapitre 2
      27, // Chapitre 3
      44, // Chapitre 4
      27, // Chapitre 5
      33, // Chapitre 6
      20, // Chapitre 7
      29, // Chapitre 8
      37, // Chapitre 9
      36, // Chapitre 10
      21, // Chapitre 11
      21, // Chapitre 12
      25, // Chapitre 13
      29, // Chapitre 14
      38, // Chapitre 15
      20, // Chapitre 16
      41, // Chapitre 17
      37, // Chapitre 18
      37, // Chapitre 19
      21, // Chapitre 20
      26, // Chapitre 21
      20, // Chapitre 22
      37, // Chapitre 23
      20, // Chapitre 24
      30, // Chapitre 25
    ],
  },
  {
    code: "1chr",
    name: "1 Chroniques",
    old: true,
    chapter: 29,
    verset: [
      54, // Chapitre 1
      55, // Chapitre 2
      24, // Chapitre 3
      43, // Chapitre 4
      26, // Chapitre 5
      81, // Chapitre 6
      40, // Chapitre 7
      40, // Chapitre 8
      44, // Chapitre 9
      14, // Chapitre 10
      47, // Chapitre 11
      40, // Chapitre 12
      14, // Chapitre 13
      17, // Chapitre 14
      29, // Chapitre 15
      43, // Chapitre 16
      27, // Chapitre 17
      17, // Chapitre 18
      19, // Chapitre 19
      8, // Chapitre 20
      30, // Chapitre 21
      19, // Chapitre 22
      32, // Chapitre 23
      31, // Chapitre 24
      31, // Chapitre 25
      32, // Chapitre 26
      34, // Chapitre 27
      21, // Chapitre 28
      30, // Chapitre 29
    ],
  },
  {
    code: "2chr",
    name: "2 Chroniques",
    old: true,
    chapter: 36,
    verset: [
      17, // Chapitre 1
      18, // Chapitre 2
      17, // Chapitre 3
      22, // Chapitre 4
      14, // Chapitre 5
      42, // Chapitre 6
      22, // Chapitre 7
      18, // Chapitre 8
      31, // Chapitre 9
      19, // Chapitre 10
      23, // Chapitre 11
      16, // Chapitre 12
      23, // Chapitre 13
      15, // Chapitre 14
      19, // Chapitre 15
      14, // Chapitre 16
      19, // Chapitre 17
      34, // Chapitre 18
      11, // Chapitre 19
      37, // Chapitre 20
      20, // Chapitre 21
      12, // Chapitre 22
      21, // Chapitre 23
      27, // Chapitre 24
      28, // Chapitre 25
      23, // Chapitre 26
      28, // Chapitre 27
      27, // Chapitre 28
      36, // Chapitre 29
      27, // Chapitre 30
      21, // Chapitre 31
      33, // Chapitre 32
      25, // Chapitre 33
      33, // Chapitre 34
      27, // Chapitre 35
      23, // Chapitre 36
    ],
  },
  {
    code: "ezra",
    name: "Esdras",
    old: true,
    chapter: 10,
    verset: [10, 27, 36, 23, 17, 22, 28, 36, 15, 44],
  },
  {
    code: "neh",
    name: "Néhémie",
    old: true,
    chapter: 13,
    verset: [11, 20, 32, 23, 19, 19, 73, 18, 38, 39, 36, 47, 31],
  },
  {
    code: "est",
    name: "Esther",
    old: true,
    chapter: 10,
    verset: [22, 23, 15, 17, 14, 14, 10, 17, 32, 3],
  },
  {
    code: "job",
    name: "Job",
    old: true,
    chapter: 42,
    verset: [
      22, 13, 26, 21, 27, 30, 21, 22, 35, 22, 20, 25, 28, 22, 35, 22, 16, 21,
      29, 29, 34, 30, 17, 25, 6, 14, 23, 28, 25, 31, 40, 22, 33, 37, 16, 33, 24,
      41, 30, 32, 26, 17,
    ],
  },
  {
    code: "psa",
    name: "Psaumes",
    old: true,
    chapter: 150,
    verset: [
      6,
      12,
      9,
      9,
      13,
      11,
      18,
      10,
      39,
      8,
      9,
      6,
      7,
      5,
      11,
      15,
      51,
      15,
      10,
      14,
      32,
      6,
      10,
      22,
      12,
      14,
      9,
      11,
      13,
      25,
      11,
      22,
      23,
      28,
      13,
      40,
      23,
      14,
      18,
      14,
      12,
      5,
      27,
      18,
      12,
      10,
      15,
      21,
      23,
      21,
      11,
      7,
      9,
      24,
      14,
      12,
      12,
      18,
      14,
      9,
      13,
      12,
      11,
      14,
      20,
      8,
      36,
      37,
      6,
      24,
      20,
      28,
      23,
      10,
      12,
      20,
      72,
      13,
      19,
      16,
      8,
      18,
      12,
      13,
      17,
      7,
      19,
      53,
      17,
      16,
      16,
      5,
      23,
      11,
      13,
      12,
      9,
      9,
      6,
      12,
      9,
      9,
      13,
      11,
      18,
      10,
      39,
      8,
      9,
      6,
      7,
      5,
      11,
      15,
      51,
      15,
      10,
      14,
      32,
      6,
      10,
      22,
      12,
      14,
      9,
      11,
      13,
      25,
      11,
      22,
      23,
      28,
      13,
      40,
      23,
      14,
      18,
      14,
      12,
      5,
      27,
      18,
      12,
      10,
      15,
      21,
      23,
      21,
      11,
      7,
      9,
      24,
      14,
      12,
      12,
      18,
      14,
      9,
      13,
      12,
      11,
      14,
      20,
      8,
      36,
      37,
      6,
      24,
      20,
      28,
      23,
      10,
      12,
      20,
      72,
      13,
      19,
      16,
      8,
      18,
      12,
      13,
      17,
      7,
      19,
      53,
      17,
      16,
      16,
      5,
      23,
      11,
      13,
      12,
      9,
      9, // Les 52 derniers chapitres
    ],
  },
  {
    code: "prv",
    name: "Proverbes",
    old: true,
    chapter: 31,
    verset: [
      33, 22, 35, 27, 23, 35, 27, 36, 18, 32, 31, 28, 25, 35, 33, 33, 28, 24,
      29, 30, 31, 29, 35, 34, 28, 28, 27, 28, 27, 33, 31,
    ],
  },
  {
    code: "eccl",
    name: "Ecclésiaste",
    old: true,
    chapter: 12,
    verset: [18, 26, 22, 17, 19, 12, 30, 17, 18, 20, 10, 14],
  },
  {
    code: "ssol",
    name: "Cantique des Cantiques",
    old: true,
    chapter: 8,
    verset: [17, 17, 11, 16, 16, 13, 13, 14],
  },
  {
    code: "isa",
    name: "Ésaïe",
    old: true,
    chapter: 66,
    verset: [
      31, 22, 26, 6, 30, 13, 25, 22, 21, 34, 16, 6, 22, 32, 9, 14, 14, 7, 25, 6,
      17, 25, 18, 23, 12, 21, 13, 29, 24, 33, 9, 20, 24, 17, 10, 22, 38, 22, 8,
      31, 29, 25, 28, 28, 25, 13, 15, 22, 26, 11, 23, 15, 12, 17, 13, 12, 21,
      14, 21, 22, 11, 12, 19, 12, 25, 24,
    ],
  },
  {
    code: "jer",
    name: "Jérémie",
    old: true,
    chapter: 52,
    verset: [
      19, 37, 25, 31, 31, 30, 34, 22, 26, 25, 23, 17, 27, 22, 32, 21, 30, 18,
      30, 40, 36, 30, 34, 22, 30, 30, 31, 34, 22, 30, 24, 25, 23, 40, 26, 38,
      22, 31, 40, 44, 26, 22, 19, 32, 21, 28, 18, 16, 18, 22, 13, 30, 5,
    ],
  },
  {
    code: "lam",
    name: "Lamentations",
    old: true,
    chapter: 5,
    verset: [22, 22, 66, 22, 22],
  },
  {
    code: "eze",
    name: "Ézéchiel",
    old: true,
    chapter: 48,
    verset: [
      28, 10, 27, 17, 17, 14, 27, 18, 11, 22, 25, 28, 23, 23, 8, 63, 24, 32, 14,
      49, 32, 31, 49, 27, 17, 21, 36, 26, 21, 26, 18, 32, 33, 31, 15, 38, 28,
      23, 29, 49, 26, 20, 27, 31, 25, 24, 23, 35,
    ],
  },
  {
    code: "dan",
    name: "Daniel",
    old: true,
    chapter: 12,
    verset: [21, 49, 30, 37, 31, 28, 28, 27, 27, 21, 45, 13],
  },
  {
    code: "hos",
    name: "Osée",
    old: true,
    chapter: 14,
    verset: [11, 23, 5, 19, 15, 11, 16, 14, 17, 15, 12, 14, 16, 9],
  },
  { code: "joel", name: "Joël", old: true, chapter: 3, verset: [20, 32, 21] },
  {
    code: "amos",
    name: "Amos",
    old: true,
    chapter: 9,
    verset: [15, 16, 15, 13, 27, 14, 17, 14, 15],
  },
  { code: "obad", name: "Abdias", old: true, chapter: 1, verset: [21] },
  {
    code: "jonah",
    name: "Jonas",
    old: true,
    chapter: 4,
    verset: [17, 10, 10, 11],
  },
  {
    code: "mic",
    name: "Michée",
    old: true,
    chapter: 7,
    verset: [16, 13, 12, 13, 15, 16, 20],
  },
  { code: "nahum", name: "Nahum", old: true, chapter: 3, verset: [15, 13, 19] },
  { code: "hab", name: "Habacuc", old: true, chapter: 3, verset: [17, 20, 19] },
  {
    code: "zep",
    name: "Sophonie",
    old: true,
    chapter: 3,
    verset: [18, 15, 20],
  },
  { code: "hag", name: "Aggée", old: true, chapter: 2, verset: [15, 23] },
  {
    code: "zep",
    name: "Zacharie",
    old: true,
    chapter: 14,
    verset: [21, 13, 10, 14, 11, 15, 14, 23, 17, 12, 17, 14, 9, 21],
  },
  {
    code: "mal",
    name: "Malachie",
    old: true,
    chapter: 4,
    verset: [14, 17, 18, 6],
  },

  {
    code: "mat",
    name: "Matthieu",
    old: false,
    chapter: 28,
    verset: [
      25, 23, 17, 25, 48, 34, 29, 34, 38, 42, 30, 50, 58, 36, 39, 28, 27, 35,
      30, 34, 46, 46, 39, 51, 46, 75, 66, 20,
    ],
  },
  {
    code: "mark",
    name: "Marc",
    old: false,
    chapter: 16,
    verset: [45, 28, 35, 41, 43, 56, 37, 38, 50, 52, 33, 44, 37, 72, 47, 20],
  },
  {
    code: "luke",
    name: "Luc",
    old: false,
    chapter: 24,
    verset: [
      80, 52, 38, 44, 39, 49, 50, 56, 62, 42, 54, 59, 35, 35, 32, 31, 37, 43,
      48, 47, 38, 71, 56, 53,
    ],
  },
  {
    code: "john",
    name: "Jean",
    old: false,
    chapter: 21,
    verset: [
      51, 25, 36, 54, 47, 71, 53, 59, 41, 42, 57, 50, 38, 31, 27, 33, 26, 40,
      42, 31, 25,
    ],
  },
  {
    code: "acts",
    name: "Actes",
    old: false,
    chapter: 28,
    verset: [
      26, 47, 26, 37, 42, 15, 60, 40, 43, 48, 30, 25, 52, 28, 41, 40, 34, 28,
      40, 38, 40, 30, 35, 27, 27, 32, 44, 31,
    ],
  },
  {
    code: "rom",
    name: "Romains",
    old: false,
    chapter: 16,
    verset: [32, 29, 31, 25, 21, 23, 25, 39, 33, 21, 36, 21, 14, 23, 33, 27],
  },
  {
    code: "1cor",
    name: "1 Corinthiens",
    old: false,
    chapter: 16,
    verset: [31, 16, 23, 21, 13, 20, 40, 13, 27, 33, 34, 31, 13, 40, 58, 24],
  },
  {
    code: "2cor",
    name: "2 Corinthiens",
    old: false,
    chapter: 13,
    verset: [24, 17, 18, 18, 21, 18, 16, 24, 15, 18, 33, 21, 13],
  },
  {
    code: "gal",
    name: "Galates",
    old: false,
    chapter: 6,
    verset: [24, 21, 29, 31, 26, 18],
  },
  {
    code: "eph",
    name: "Éphésiens",
    old: false,
    chapter: 6,
    verset: [23, 22, 21, 32, 33, 24],
  },
  {
    code: "phi",
    name: "Philippiens",
    old: false,
    chapter: 4,
    verset: [30, 30, 21, 23],
  },
  {
    code: "col",
    name: "Colossiens",
    old: false,
    chapter: 4,
    verset: [29, 23, 25, 18],
  },
  {
    code: "1th",
    name: "1 Thessaloniciens",
    old: false,
    chapter: 5,
    verset: [10, 20, 13, 18, 28],
  },
  {
    code: "2th",
    name: "2 Thessaloniciens",
    old: false,
    chapter: 3,
    verset: [12, 17, 18],
  },
  {
    code: "1tim",
    name: "1 Timothée",
    old: false,
    chapter: 6,
    verset: [20, 15, 16, 16, 25, 21],
  },
  {
    code: "2tim",
    name: "2 Timothée",
    old: false,
    chapter: 4,
    verset: [18, 26, 17, 22],
  },
  { code: "titus", name: "Tite", old: false, chapter: 3, verset: [16, 15, 15] },
  { code: "phmn", name: "Philémon", old: false, chapter: 1, verset: [25] },
  {
    code: "heb",
    name: "Hébreux",
    old: false,
    chapter: 13,
    verset: [14, 18, 19, 16, 14, 20, 28, 13, 28, 39, 40, 29, 25],
  },
  {
    code: "jas",
    name: "Jacques",
    old: false,
    chapter: 5,
    verset: [27, 26, 18, 17, 20],
  },
  {
    code: "1pet",
    name: "1 Pierre",
    old: false,
    chapter: 5,
    verset: [25, 25, 22, 19, 14],
  },
  {
    code: "2pet",
    name: "2 Pierre",
    old: false,
    chapter: 3,
    verset: [21, 22, 18],
  },
  {
    code: "1jn",
    name: "1 Jean",
    old: false,
    chapter: 5,
    verset: [10, 29, 24, 21, 21],
  },
  { code: "2jn", name: "2 Jean", old: false, chapter: 1, verset: [13] },
  { code: "3jn", name: "3 Jean", old: false, chapter: 1, verset: [15] },
  { code: "jude", name: "Jude", old: false, chapter: 1, verset: [25] },
  {
    code: "rev",
    name: "Apocalypse",
    old: false,
    chapter: 22,
    verset: [
      20, 29, 22, 11, 14, 17, 17, 13, 21, 11, 19, 18, 18, 20, 8, 21, 18, 24, 21,
      15, 27, 21,
    ],
  },
];

export const bibleVersions = (
  bible: string,
  livre: string,
  chap: string,
  verset: string,
) => {
  return require(`@/lib/bible_version/bible-${bible}.json`)?.[livre]?.[chap]?.[
    verset
  ];
};

interface BibleVersionInterface {
  name: string;
  code: string;
  id: number;
}

export const bibleVersionsCompare: BibleVersionInterface[] = [
  {
    code: "lsg",
    name: "Bible Segond 1910",
    id: 0,
  },
  {
    code: "nbs",
    name: "Nouvelle Bible Segond",
    id: 1,
  },
  {
    code: "s21",
    name: "Bible Segond 21",
    id: 2,
  },
  {
    code: "kjf",
    name: "King James Française",
    id: 3,
  },
  {
    code: "dby",
    name: "Bible Darby",
    id: 4,
  },
  {
    code: "ost",
    name: "Ostervald",
    id: 5,
  },
  {
    code: "chu",
    name: "Bible Chouraqui 1985",
    id: 6,
  },
  {
    code: "bds",
    name: "Bible du Semeur",
    id: 7,
  },
  {
    code: "fmar",
    name: "Martin 1744",
    id: 8,
  },
  {
    code: "bfc",
    name: "Bible en Français courant",
    id: 9,
  },
  {
    code: "frc97",
    name: "Français courant",
    id: 10,
  },
  {
    code: "nfc",
    name: "Nouvelle Français courant",
    id: 11,
  },
  {
    code: "kjv",
    name: "King James Version",
    id: 12,
  },
  {
    code: "esv",
    name: "English Standard Version",
    id: 13,
  },
  {
    code: "niv",
    name: "New International Version",
    id: 14,
  },
  {
    code: "bcc1923",
    name: "Bible catholique Crampon 1923",
    id: 15,
  },
  {
    code: "pdv2017",
    name: "Parole de Vie 2017",
    id: 16,
  },
  {
    code: "pov",
    name: "Parole vivante (NT)",
    id: 17,
  },
  {
    code: "amp",
    name: "Amplified Bible",
    id: 18,
  },
  {
    code: "tr1624",
    name: "Elzevir Textus Receptus 1624 (NT)",
    id: 19,
  },
  {
    code: "tr1894",
    name: "Scrivener’s Textus Receptus 1894 (NT)",
    id: 20,
  },
];

export function getBibleVersion(version: string) {
  return require(`./bible/bible-${version}.json`);
}
