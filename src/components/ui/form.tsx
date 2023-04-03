import React from "react";
import { useForm } from "react-hook-form";

// Define the type for Form props
interface FormProps {
  defaultValues?: Record<string, any>;
  children?: React.ReactNode;
  onSubmit: (data: Record<string, any>) => void;
}

export function Form({ defaultValues, children, onSubmit }: FormProps) {
  const { handleSubmit, register } = useForm({ defaultValues });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {Array.isArray(children)
        ? children.map((child) => {
            return child.props.name
              ? React.createElement(child.type, {
                  ...{
                    ...child.props,
                    register,
                    key: child.props.name,
                  },
                })
              : child;
          })
        : children}
    </form>
  );
}
