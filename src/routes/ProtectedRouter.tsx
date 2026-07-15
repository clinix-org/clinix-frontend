import { Navigate, useLocation } from "react-router-dom";
import { MainLayout } from "../components/layout/MainLayout";
import { useAuth } from "../context/useAuth";

const SessionLoading = () => (
    <main className="flex min-h-screen items-center justify-center bg-[#f4f4f5] px-4">
        <section
            className="w-full max-w-[360px] rounded-lg bg-white p-6 text-center shadow-sm"
            aria-live="polite"
            aria-busy="true"
        >
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-3 border-[#d7dade] border-t-[#0cad69]" />
            <h1 className="text-base font-semibold text-[#3f464d]">Validando sessao</h1>
            <p className="mt-2 text-sm text-[#646b72]">Estamos preparando seu acesso com seguranca.</p>
        </section>
    </main>
);

const TemporaryUnavailable = () => (
    <main className="flex min-h-screen items-center justify-center bg-[#f4f4f5] px-4">
        <section className="w-full max-w-[420px] rounded-lg bg-white p-6 text-center shadow-sm">
            <h1 className="text-lg font-semibold text-[#3f464d]">Servico temporariamente indisponivel</h1>
            <p className="mt-2 text-sm leading-6 text-[#646b72]">
                Nao foi possivel validar sua sessao agora. Tente entrar novamente em instantes.
            </p>
            <a
                href="/login"
                className="mt-5 inline-flex h-10 items-center justify-center rounded-lg bg-[#0cad69] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#0a8c55]"
            >
                Voltar ao login
            </a>
        </section>
    </main>
);

export const ProtectedRouter = () => {
    const { status, isAuthenticated } = useAuth();
    const location = useLocation();
    const redirectTo = `${location.pathname}${location.search}`;

    if (status === "idle" || status === "loading") {
        return <SessionLoading />;
    }

    if (status === "error") {
        return <TemporaryUnavailable />;
    }

    if (status === "forbidden") {
        return <Navigate to="/403" replace />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace state={{ from: redirectTo }} />;
    }

    return <MainLayout />;
};
