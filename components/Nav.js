import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Nav({ show, setShowNav }) {
  const inactiveLink = "flex gap-1 p-1 link";
  const activeLink =
    inactiveLink + " bg-highlight text-black rounded-sm link-active";
  const inactiveIcon = "w-6 h-6";
  const router = useRouter();
  const { pathname } = router;
  async function logout() {
    await router.push("/");
    await signOut();
  }
  const { data: session } = useSession();
  return (
    <aside
      className={
        (show ? "left-0" : "-left-full") +
        " top-0 text-gray-500 p-4 fixed w-full bg-bgGray h-full md:static md:w-auto transition-all"
      }
    >
      <button className="md:hidden" onClick={() => setShowNav(!show)}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-6 h-6"
        >
          <path
            fillRule="evenodd"
            d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      <nav className="nav">
        <div className="list">
          <div className="nav-caption">Основные</div>
          <Link
            href={"/"}
            className={pathname === "/" ? activeLink : inactiveLink}
          >
            Главная Панель
          </Link>
          <Link
            href={"/create"}
            className={pathname === "/create" ? activeLink : inactiveLink}
          >
            Создать новость
          </Link>
          <Link
            href={"/comments"}
            className={pathname === "/comments" ? activeLink : inactiveLink}
          >
            Комментарий
          </Link>
          <Link
            href={"/graphics"}
            className={pathname === "/graphics" ? activeLink : inactiveLink}
          >
            Графики
          </Link>

          <hr />
          <button onClick={logout} className={inactiveLink}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
              />
            </svg>
            Выйти
          </button>
        </div>
      </nav>
      <div className="nav-sell">
        <Link href="https://diasqazaqbro.vercel.app/" target="_blank">
          Made with in diasqazaqbro
        </Link>
      </div>
    </aside>
  );
}
