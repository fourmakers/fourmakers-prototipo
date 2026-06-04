import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <h1 className="page-title mb-2">404</h1>
      <p className="page-subtitle mb-6">Página não encontrada</p>
      <Link
        to={import.meta.env.BASE_URL === "/" ? "/" : import.meta.env.BASE_URL}
        className="text-sm font-semibold text-primary underline hover:text-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      >
        Voltar ao início
      </Link>
    </div>
  );
};

export default NotFound;
