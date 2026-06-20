import loginImage from "@/assets/login_image.png";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useState } from "react";

type Mode = "login" | "forgot" | "forgot-sent";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [mode, setMode] = useState<Mode>("login");

  function handleForgotSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMode("forgot-sent");
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0 w-full md:w-[800px]">
        <CardContent className="grid p-0 md:grid-cols-2 h-[460px]">
          {mode === "login" && (
            <form className="p-6 md:p-8 flex flex-col justify-center">
              <FieldGroup>
                <div className="flex flex-col items-center gap-2 text-center">
                  <h1 className="text-2xl font-bold">Bem-vindo de volta</h1>
                  <p className="text-balance text-muted-foreground">
                    Entre na sua conta
                  </p>
                </div>
                <Field>
                  <FieldLabel htmlFor="usuario">Usuário</FieldLabel>
                  <Input
                    id="usuario"
                    type="text"
                    placeholder="usuário"
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="password">Senha</FieldLabel>
                  <Input id="password" type="password" required />
                  <button
                    type="button"
                    onClick={() => setMode("forgot")}
                    className="text-sm underline-offset-2 hover:underline text-left"
                  >
                    Esqueceu sua senha?
                  </button>
                </Field>
                <Field>
                  <Button type="submit">Entrar</Button>
                </Field>
              </FieldGroup>
            </form>
          )}

          {mode === "forgot" && (
            <form className="p-6 md:p-8 flex flex-col justify-center" onSubmit={handleForgotSubmit}>
              <FieldGroup>
                <div className="flex flex-col items-center gap-2 text-center">
                  <h1 className="text-2xl font-bold">Recuperar senha</h1>
                  <p className="text-balance text-muted-foreground">
                    Informe seu usuário para solicitar uma nova senha
                  </p>
                </div>
                <Field>
                  <FieldLabel htmlFor="usuario-recuperar">Usuário</FieldLabel>
                  <Input
                    id="usuario-recuperar"
                    type="text"
                    placeholder="usuário"
                    required
                  />
                </Field>
                <Field>
                  <Button type="submit">Enviar</Button>
                </Field>
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className="text-sm underline-offset-2 hover:underline text-center"
                >
                  Voltar ao login
                </button>
              </FieldGroup>
            </form>
          )}

          {mode === "forgot-sent" && (
            <div className="p-6 md:p-8 flex flex-col items-center justify-center gap-4 text-center h-full">
              <h1 className="text-2xl font-bold">Solicitação enviada</h1>
              <p className="text-muted-foreground">
                Um dos administradores do sistema entrará em contato para
                informar a nova senha.
              </p>
              <button
                type="button"
                onClick={() => setMode("login")}
                className="text-sm underline-offset-2 hover:underline"
              >
                Voltar ao login
              </button>
            </div>
          )}

          <div className="relative hidden bg-muted md:block">
            <img
              src={loginImage}
              alt="Login"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.4]"
            />
          </div>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        Portal Gestão NOC — Monitorando redes, garantindo conectividade.
      </FieldDescription>
    </div>
  )
}
