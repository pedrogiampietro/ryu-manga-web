import { z } from "zod";
import { Link } from "react-router-dom";
import { useFieldArray, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/useAuth";
import { apiClient } from "@/services/apiClient";

const profileFormSchema = z.object({
  username: z
    .string()
    .min(2, {
      message: "Username must be at least 2 characters.",
    })
    .max(30, {
      message: "Username must not be longer than 30 characters.",
    }),
  email: z
    .string({
      required_error: "Please select an email to display.",
    })
    .email(),
  bio: z.string().max(160).min(4),
  urls: z
    .array(
      z.object({
        value: z.string().url({ message: "Please enter a valid URL." }),
      })
    )
    .optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function ProfileForm() {
  const { user, setUser } = useAuth();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      ...user,
    },
  });

  async function onSubmit(data: ProfileFormValues) {
    const body = {
      username: data.username,
      email: data.email,
      bio: data.bio,
      urls: data.urls,
      userId: user?.userId,
    };

    try {
      const response = await apiClient().patch("/v1/user/update-user", body);

      if (response.status === 200) {
        const updatedUser = {
          ...user,
          username: response.data.user.username,
          email: response.data.user.email,
          bio: response.data.user.bio,
          urls: response.data.user.urls,
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
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>
                Este é o seu nome de exibição público. Pode ser seu nome
                verdadeiro ou um pseudônimo. Você só pode alterar isso uma vez a
                cada 30 dias.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="ryuz@dev.com" {...field} />
              </FormControl>
              <FormDescription>
                You can manage verified email addresses in your
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Conte-nos um pouco sobre você"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Você pode <span>@mencionar</span> outros usuários e organizações
                para link para eles.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Update profile</Button>
      </form>
    </Form>
  );
}
