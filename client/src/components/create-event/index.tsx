import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import storeEvent from "../../services/event/applications/store-event.service";
import {
  createEventSchema,
  type TCreateEventForm,
} from "../../schemas/event/create-event.schema";
import Label from "../form/label";
import Input from "../form/input";

export default function CreateEvent() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TCreateEventForm>({ resolver: zodResolver(createEventSchema) });

  const { mutate, isPending } = useMutation({
    mutationFn: storeEvent,
    onSuccess: () => {
      toast.success("Evento criado com sucesso.");
      navigate("/");
    },
    onError: (error) => {
      console.error("Erro ao criar evento:", error);
      toast.error("Erro ao criar evento. Por favor, tente novamente.");
    },
  });

  const onSubmit = (data: TCreateEventForm) => {
    mutate(data);
  };

  const isLoading = isSubmitting || isPending;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="px-6 py-5 border border-neutral-200 rounded-xl shadow flex flex-col gap-4"
    >
      <h2 className="text-2xl font-semibold">Criar novo evento</h2>
      <div className="flex flex-col gap-1">
        <Label htmlFor="title" label="Título" required />
        <Input
          {...register("title")}
          id="title"
          placeholder="Ex.: NLW Connect"
          disabled={isLoading}
        />
        {errors.title && (
          <span className="text-xs font-semibold text-red-600">
            {errors.title.message}
          </span>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <Label htmlFor="details" label="Detalhes" required />
        <textarea
          {...register("details")}
          id="details"
          rows={4}
          placeholder="Ex.: Crie um projeto em apenas três aulas gratuitas: nessa edição vamos codar o DevStage."
          className="text-sm w-full px-3 py-1.5 rounded-md border border-neutral-200"
          disabled={isLoading}
        ></textarea>
        {errors.details && (
          <span className="text-xs font-semibold text-red-600">
            {errors.details.message}
          </span>
        )}
      </div>
      <div className="flex flex-col gap-1">
        <Label
          htmlFor="maximunAttendees"
          label="Máximo de participantes"
          required
        />
        <Input
          {...register("maximunAttendees", { valueAsNumber: true })}
          type="number"
          id="maximunAttendees"
          min={1}
          step={1}
          placeholder="Ex.: 100"
          disabled={isLoading}
        />
        {errors.maximunAttendees && (
          <span className="text-xs font-semibold text-red-600">
            {errors.maximunAttendees.message}
          </span>
        )}
      </div>
      <div className="flex gap-4">
        <Link
          to="/"
          className="text-sm font-semibold text-center min-h-8 px-2.5 py-1.5 border border-neutral-200 rounded-lg flex items-center justify-center hover:bg-neutral-100"
        >
          Cancelar
        </Link>
        <button
          type="submit"
          disabled={isLoading}
          className="text-white text-sm font-semibold text-center bg-black w-full min-h-8 px-2.5 py-1.5 rounded-lg flex items-center justify-center hover:cursor-pointer hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? "Criando..." : "Criar evento"}
        </button>
      </div>
    </form>
  );
}
