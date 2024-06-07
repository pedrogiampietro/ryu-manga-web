import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "@radix-ui/react-icons";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "@/components/ui/use-toast";
import { apiClient } from "@/services/apiClient";
import { useAuth } from "@/hooks/useAuth";

const accountFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Name must be at least 2 characters.",
    })
    .max(30, {
      message: "Name must not be longer than 30 characters.",
    }),
  birthDate: z.date({
    required_error: "A date of birth is required.",
  }),
});

type AccountFormValues = z.infer<typeof accountFormSchema>;

export function AccountForm() {
  const { user, setUser } = useAuth();

  if (!user) {
    toast({
      title: "Ohhh!",
      description:
        "Temos um problema, parece que seu usuário não foi autenticado",
    });
    return null;
  }

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      ...user,
      birthDate: user ? new Date(user.birthDate) : new Date(),
    },
  });

  async function onSubmit(data: AccountFormValues) {
    const birthDate = format(new Date(data.birthDate), "yyyy-MM-dd");

    const body = {
      name: data.name,
      birthDate: birthDate,
      userId: user?.userId,
    };

    try {
      const response = await apiClient().patch("/v1/user/update-user", body);

      if (response.status === 200) {
        const updatedUser = {
          ...user,
          name: response.data.user.name,
          birthDate: response.data.user.birthDate,
        };

        setUser(updatedUser);

        toast({
          title: "Sucesso!",
          description:
            "Opa! parece que seus dados foram atualizados com sucesso! 💚",
        });
      }
    } catch (error) {
      console.error("API request error:", error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Seu nome" {...field} />
              </FormControl>
              <FormDescription>
                Você pode gerenciar endereços de e-mail verificados nas
                configurações de e-mail.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="birthDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Data do seu aniversário</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(new Date(field.value), "d MMM, yyyy")
                      ) : (
                        <span>Escolha a data</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date: Date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                Sua data de nascimento é usada para calcular sua idade.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Update account</Button>
      </form>
    </Form>
  );
}
