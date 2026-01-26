import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  Field,
  FieldLabel,
  FieldContent,
  FieldError,
} from "@/components/ui/field";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { usersService, type User } from "@/services/users";
import { useEffect, useState } from "react";
import { extractErrorMessages } from "@/lib/api";

interface Props {
  userId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ViewUserDrawer({ userId, open, onOpenChange }: Props) {
  const query = useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      if (!userId) throw new Error("No user id provided");
      return usersService.getById(userId);
    },
    enabled: open && !!userId,
  });

  const queryClient = useQueryClient();
  const [selectedRole, setSelectedRole] = useState<"user" | "admin" | "">("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open && userId) query.refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, userId]);

  useEffect(() => {
    if (query.data) setSelectedRole(query.data.role);
  }, [query.data]);

  const changeRoleMutation = useMutation({
    mutationFn: (role: "user" | "admin") =>
      usersService.changeRole(userId!, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", userId] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setError(null);
    },
    onError: async (err) => {
      const [message] = await extractErrorMessages(err);
      setError(message ?? "No se pudo actualizar el usuario.");
    },
  });

  const user: User | null = query.data ?? null;

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{user ? user.name : "Cargando..."}</DrawerTitle>
        </DrawerHeader>

        {query.isLoading ? (
          <div className="p-4">Cargando usuario...</div>
        ) : query.isError ? (
          <div className="text-destructive p-4">
            No se pudo cargar el usuario.
          </div>
        ) : user ? (
          <div className="space-y-4 p-4">
            <div className="text-xs text-slate-500">ID: {user.id}</div>

            <Field>
              <FieldLabel className="font-bold">Nombre de usuario</FieldLabel>
              <FieldContent>
                <div className="text-sm">{user.username}</div>
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel className="font-bold">Nombre</FieldLabel>
              <FieldContent>
                <div className="text-sm">{user.name}</div>
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel className="font-bold">Email</FieldLabel>
              <FieldContent>
                <div className="text-sm">{user.email ?? "—"}</div>
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel className="font-bold">Rol</FieldLabel>
              <FieldContent>
                <div className="flex items-center gap-3">
                  <Select
                    value={selectedRole || user.role}
                    onValueChange={(val) =>
                      setSelectedRole(val as "user" | "admin")
                    }
                  >
                    <SelectTrigger size="sm">
                      <SelectValue>{selectedRole || user.role}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">user</SelectItem>
                      <SelectItem value="admin">admin</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button
                    onClick={() =>
                      changeRoleMutation.mutate(
                        selectedRole as "user" | "admin",
                      )
                    }
                    disabled={
                      changeRoleMutation.isPending ||
                      selectedRole === user.role ||
                      !selectedRole
                    }
                  >
                    {changeRoleMutation.isPending ? "Guardando..." : "Guardar"}
                  </Button>
                </div>

                {error && <FieldError>{error}</FieldError>}
              </FieldContent>
            </Field>

            <DrawerFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cerrar
              </Button>
            </DrawerFooter>
          </div>
        ) : null}
      </DrawerContent>
    </Drawer>
  );
}
