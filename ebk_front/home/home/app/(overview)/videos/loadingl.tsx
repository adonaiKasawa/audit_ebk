import CardVideoFileSkleton from "@/ui/skeleton/card.video.file.skleton";

export default function Loading() {
  return (
    <section className="grid grid-cols-2 md:grid-cols-3 xs:grid-cols-2 gap-4 mt-4">
      {[1, 2, 3, 4].map((i) => (
        <CardVideoFileSkleton key={i} />
      ))}
    </section>
  );
}
