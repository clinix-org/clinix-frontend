import { Link } from "react-router-dom";

export const Forbidden = () => (
    <main className="flex min-h-screen items-center justify-center bg-[#f4f4f5] px-4">
        <section className="w-full max-w-[420px] rounded-lg bg-white p-6 text-center shadow-sm">
            <p className="text-sm font-semibold uppercase text-[#c43b4c]">403</p>
            <h1 className="mt-2 text-xl font-semibold text-[#3f464d]">Acesso negado</h1>
            <p className="mt-3 text-sm leading-6 text-[#646b72]">
                Seu usuario nao tem permissao para acessar esta area.
            </p>
            <Link
                to="/dashboard"
                className="mt-5 inline-flex h-10 items-center justify-center rounded-lg bg-[#0cad69] px-4 text-sm font-semibold text-white transition-colors hover:bg-[#0a8c55]"
            >
                Voltar ao inicio
            </Link>
        </section>
    </main>
);
