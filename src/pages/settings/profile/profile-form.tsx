import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
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
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { setStorageModel } from "@/lib/storage";
import { auth } from "@/constants/auth";
import { LottieLoad } from "@/components/custom/loading";

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
  avatar: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function ProfileForm() {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [avatar, setAvatar] = useState();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      ...user,
    },
  });

  const handleImageChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      const objectURL = URL.createObjectURL(file);
      setAvatarPreview(objectURL);
    }
  };

  async function onSubmit(data: ProfileFormValues) {
    setLoading(true);

    const formData = new FormData();
    formData.append("username", data.username);
    formData.append("email", data.email);
    formData.append("bio", data.bio);
    formData.append("urls", JSON.stringify(data.urls));
    formData.append("userId", user?.userId);
    if (avatar) {
      formData.append("avatar", avatar);
    }

    try {
      const response = await apiClient().patch(
        "/v1/user/update-user",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        const updatedUser = {
          ...user,
          username: response.data.user.username,
          email: response.data.user.email,
          bio: response.data.user.bio,
          urls: response.data.user.urls,
          avatar: response.data.user.avatar,
        };

        setUser(updatedUser);
        setStorageModel(auth.USER, JSON.stringify(updatedUser));
        setLoading(false);
        toast({
          title: "Sucesso!",
          description:
            "Opa! parece que seus dados foram atualizados com sucesso! 💚",
        });
      }
    } catch (error) {
      console.error("API request error:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <LottieLoad />;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="sm:max-w-lg w-full rounded-xl z-10">
          <div className="grid grid-cols-1 space-y-2">
            <label className="text-sm font-bold text-gray-500 tracking-wide">
              Selecione uma foto para o perfil
            </label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col rounded-lg border-4 border-dashed w-full h-40 p-10 group text-center">
                <div className="h-full w-full text-center flex flex-col items-center justify-center">
                  <div className="flex flex-auto max-h-48 mx-auto -mt-10">
                    {avatarPreview && (
                      <Avatar>
                        <AvatarImage src={avatarPreview} />
                      </Avatar>
                    )}
                  </div>
                  <p className="pointer-none text-gray-500 ">
                    <span className="text-sm">Arraste e solte</span> uma foto
                    aqui <br /> ou{" "}
                    <a href="" id="" className="text-primary hover:underline">
                      selecione uma foto
                    </a>{" "}
                    do seu computador
                  </p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            </div>
          </div>
          <p className="text-sm text-gray-500">
            <FormDescription>
              Os principais tipos de imagens são parmitidos como: jpg, png, gif,
              jpeg
            </FormDescription>
          </p>
        </div>

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
                Você pode gerenciar endereços de e-mail verificados em seu
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
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Update profile</Button>
      </form>
    </Form>
  );
}
