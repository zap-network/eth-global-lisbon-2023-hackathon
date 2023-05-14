import { useState } from "react";
import { Button, Modal, Text, Input } from "@nextui-org/react";
import { useForm } from "react-hook-form";
import React from "react";
import styled from 'styled-components';


type FormData = {
  name: string;
  email: string;
};

const Form = styled.form`
`
const FormModal = () => {
  const [visible, setVisible] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    console.log(data);
    setVisible(false);
  };

  return (
    <>
      <Modal visible={visible} onClose={() => setVisible(false)}>
        <Modal.Title>Add User</Modal.Title>
        <Modal.Content>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Text block>Name</Text>
            <Input
              type="text"
              placeholder="Enter your name"
              {...register("name", { required: true })}
            />
            {errors.name && <Text block color="red">Name is required</Text>}
            <Text block>Email</Text>
            <Input
              type="email"
              placeholder="Enter your email"
              {...register("email", { required: true })}
            />
            {errors.email && (
              <Text block color="red">Email is required</Text>
            )}
            <Button type="submit">Submit</Button>
          </Form>
        </Modal.Content>
      </Modal>
    </>
  );
};

export default FormModal;
