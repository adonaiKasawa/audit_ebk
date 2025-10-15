import React from 'react';

export function getRandomInt(n: number) {
  return Math.floor(Math.random() * n);
}

export function shuffle(s: string) {
  var arr = s.split('');
  var n = arr.length;

  for (var i = 0; i < n - 1; ++i) {
    var j = getRandomInt(n);

    var temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }

  s = arr.join('');
  return s;
}

export function randomArray(array: any[]) {
  if (array.length > 0) {
    for (let i = 0; i < array.length - 1; i++) {
      const j = Math.floor(Math.random() * (array.length - i));

      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
  }

  return array;
}

export function Duration({
  className,
  seconds,
}: {
  className?: string | undefined;
  seconds: number;
}) {
  return (
    <time dateTime={`P${Math.round(seconds)}S`} className={className}>
      {formatSecondeTime(seconds)}
    </time>
  );
}

export function formatSecondeTime(seconds: number) {
  const date = new Date(seconds * 1000);
  const hh = date.getUTCHours();
  const mm = date.getUTCMinutes();
  const ss = pad(date.getUTCSeconds());
  if (hh) {
    return `${hh}:${pad(mm)}:${ss}`;
  }
  return `${pad(mm)}:${ss}`;
}

export function pad(string: any) {
  return ('0' + string).slice(-2);
}

export function capitalize(str: any) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function uppercase(str: any) {
  return str.toUpperCase();
}

export function base64DataToFile(
  base64Data: string,
  filename: string = 'image_annonce',
) {
  const toBase64 = base64Data.substring(22);
  const binaryData = Buffer.from(toBase64, 'base64');
  // return new File([binaryData], "image.jpg", { type: 'image/jpeg' })
}

export function isPaire(nombre: number) {
  return nombre % 2 === 0;
}

export function formatBytes(bytes: number) {
  const sizes = ['Bytes', 'ko', 'MB', 'GB', 'TB'];

  if (bytes === 0) return '0 Bytes';

  const i = Math.floor(Math.log(bytes) / Math.log(1024)); // Trouver l'indice correspondant à la bonne unité
  const value = Math.round(bytes / Math.pow(1024, i)); // Convertir et arrondir à l'entier le plus proche

  return `${value} ${sizes[i]}`;
}

export function groupConsecutiveVerses(
  verseTextSelected: {id: number; text: string}[],
  separator: string = ', ',
): string {
  const sortedVerses = [...verseTextSelected].sort((a, b) => a.id - b.id);
  if (sortedVerses.length > 0) {
    const groups: string[] = [];
    let start = sortedVerses[0].id;
    let end = start;

    for (let i = 1; i < sortedVerses.length; i++) {
      const currentId = sortedVerses[i].id;
      if (currentId === end + 1) {
        end = currentId;
      } else {
        groups.push(start === end ? `${start}` : `${start}-${end}`);
        start = currentId;
        end = currentId;
      }
    }

    groups.push(start === end ? `${start}` : `${start}-${end}`);

    return groups.join(separator);
  }
  return '';
}
