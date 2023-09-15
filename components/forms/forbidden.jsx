import Link from "next/link";

export default function Forbidden() {
  return (
    <div className="forbiddentext-wrapper">
      <div className="forbiddensubtitle">
        شما دسترسی به محتوای مورد نظر را ندارید
      </div>

      <div className="forbidenbuttons">
        <Link className="button" href="/dashboard">
          بازگشت به خانه
        </Link>
      </div>
    </div>
  );
}
