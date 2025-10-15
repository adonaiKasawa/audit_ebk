import { FiChevronsRight } from "react-icons/fi";
import Link from "next/link";
import { Card } from "@heroui/card";
import { Checkbox } from "@heroui/checkbox";
import { Divider } from "@heroui/divider";
import { Image } from "@heroui/image";

import books from "@/lib/bible_book";
import { file_url } from "@/app/lib/request/request";
import {
  ContentDayPlan,
  ItemBiblePlanLecture,
} from "@/app/lib/config/interface";

const PlanInfoComponent = ({
  PlanLecture,
  day,
  contentDay,
  contents,
}: {
  PlanLecture: ItemBiblePlanLecture;
  day: number;
  contentDay: number;
  content: {
    from: number;
    to: number;
  };
  contents?: ContentDayPlan;
}) => {
  // const [view, setView] = useState(false);

  return (
    <Card
      className="flex flex-col p-4 max-w-3xl mx-auto"
      // style={{
      //   width: "36rem !important",
      // }}
    >
      <div className="flex items-center justify-between mb-4">
        <p className="text-gray-500 text-sm">Plan Info</p>
      </div>
      <div className="flex items-center mb-4">
        <Image
          alt={`${PlanLecture.title}`}
          className="w-16 h-16 object-cover rounded-md mr-4"
          height={120}
          src={`${
            PlanLecture.picture
              ? file_url + PlanLecture.picture
              : `./ecclessia.png`
          }`}
          style={{
            marginRight: 20,
          }}
          width={120}
        />
        <div>
          <h2 className="text-lg font-bold">{PlanLecture.title}</h2>
          <p className="text-sm text-gray-600">
            Jour {day} sur {contentDay}
          </p>
        </div>
        {/* <Button
          color="primary"
          className="ml-auto"
          endContent={view ? <FiChevronUp /> : <FiChevronDown />}
          onClick={() => setView(!view)}
        >
          {content.from} sur {contentDay}
        </Button> */}
      </div>
      {/* {view && ( */}
      <div className="space-y-2">
        <Link href={`/plan-lecture/${PlanLecture.id}/${day}/devotion`}>
          <div className="my-2 flex items-center align-middle">
            <Checkbox disabled isSelected className="mr-2" color="primary" />
            <p className="text-sm">Motivation</p>
          </div>
        </Link>
        {contents?.contents &&
          contents.contents.map((a, i) => (
            <div key={i}>
              <Divider />
              <Link href={`/plan-lecture/${PlanLecture.id}/${day}/${a.id}`}>
                <div className="my-2 flex items-center justify-between">
                  <p className="text-sm">
                    {`${
                      books.find((b) => b.Numero == parseInt(a.book))?.Nom
                    } ${a.chapter}${a.verse != null ? `:${a.verse}` : ""}`}
                  </p>
                  <FiChevronsRight />
                </div>
              </Link>
            </div>
          ))}
      </div>
      {/* )} */}
    </Card>
  );
};

export default PlanInfoComponent;
