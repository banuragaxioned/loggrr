import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export default function CreateClient() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const onSubmit = (data: any) => {
    console.log(data);
    reset();
  };
  console.log(errors);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        type="text"
        placeholder="Client name"
        {...register("Client name", { required: true, maxLength: 10 })}
      />

      <Button type="submit">Submit</Button>
    </form>
  );
}
