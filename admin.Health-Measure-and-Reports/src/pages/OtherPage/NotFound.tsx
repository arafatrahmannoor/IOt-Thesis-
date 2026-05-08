import { Link } from "react-router-dom";
import GridShape from "../../components/common/GridShape";
import PageMeta from "../../components/common/PageMeta";

export default function NotFound() {
  return (
    <>
      <PageMeta
        title="404 Dashboard | Airduino Health Monitor"
        description="Page not found - Airduino Health Monitor Dashboard"
      />
      <div className="relative flex flex-col items-center justify-center min-h-screen p-6 overflow-hidden z-1">
        <GridShape />
        <div className="mx-auto w-full max-w-[242px] text-center sm:max-w-[472px]">
          <h1 className="mb-8 font-bold text-gray-800 text-title-md  xl:text-title-2xl">
            ERROR
          </h1>

          <img src="/images/error/404.svg" alt="404" className="dark:hidden" />
          <img
            src="/images/error/404-dark.svg"
            alt="404"
            className="hidden dark:block"
          />

          <p className="mt-10 mb-6 text-base text-gray-700  sm:text-lg">
            We can’t seem to find the page you are looking for!
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-3.5 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800  dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
            >
              Back to Home Page
            </Link>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-3.5 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800  dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
            >
              Refresh
            </button>
          </div>
          {/* <!-- Footer --> */}
          <p className="text-sm text-center text-gray-500 mt-5">
            &copy; {new Date().getFullYear()} - Airduino Health Monitor
          </p>
        </div>
      </div>
    </>
  );
}
