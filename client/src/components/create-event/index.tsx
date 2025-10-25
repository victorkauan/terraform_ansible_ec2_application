import { Link } from "react-router";

export default function CreateEvent() {
  return (
    <form className="px-6 py-5 border border-neutral-200 rounded-xl shadow flex flex-col gap-4">
      <h2 className="text-2xl font-semibold">Criar novo evento</h2>
      <div className="flex flex-col gap-1">
        <label htmlFor="title" className="text-sm font-semibold">
          Título <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          name="title"
          placeholder="Ex.: NLW Connect"
          className="text-sm w-full px-3 py-1.5 rounded-md border border-neutral-200"
          required
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="details" className="text-sm font-semibold">
          Detalhes <span className="text-red-500">*</span>
        </label>
        <textarea
          id="details"
          name="details"
          rows={4}
          placeholder="Ex.: Crie um projeto em apenas três aulas gratuitas: nessa edição vamos codar o DevStage."
          className="text-sm w-full px-3 py-1.5 rounded-md border border-neutral-200"
          required
        ></textarea>
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="maximunAttendees" className="text-sm font-semibold">
          Máximo de participantes <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          id="maximunAttendees"
          name="maximunAttendees"
          min={1}
          step={1}
          placeholder="Ex.: 100"
          className="text-sm w-full px-3 py-1.5 rounded-md border border-neutral-200"
          required
        />
      </div>
      <div className="flex gap-4">
        <Link
          to="/"
          className="text-sm font-semibold text-center min-h-8 px-2.5 py-1.5 border border-neutral-200 rounded-lg flex items-center justify-center hover:bg-neutral-100"
        >
          Cancelar
        </Link>
        <button className="text-white text-sm font-semibold text-center bg-black w-full min-h-8 px-2.5 py-1.5 rounded-lg flex items-center justify-center hover:cursor-pointer hover:bg-neutral-800">
          Criar evento
        </button>
      </div>
    </form>
  );
}
