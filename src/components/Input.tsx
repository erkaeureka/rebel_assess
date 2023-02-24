// import "./index.css";
import { Button, Form, Input } from "antd";
import axios from "axios";
import { Artist } from "./MyTable";

type Props = {
  onNewValue(arg: Artist): void;
};
const InputForm = (props: Props) => {
  const [form] = Form.useForm();
  const onSubmit = () => {
    axios
      .post("https://rebel-test.azurewebsites.net/api/Artist", {
        name: form.getFieldValue("name"),
        streams: form.getFieldValue("stream"),
        rate: form.getFieldValue("rate"),
      })
      .then((response) => {
        props.onNewValue(response.data);
        form.resetFields();
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  return (
    <Form
      autoComplete="off"
      layout={"vertical"}
      form={form}
      // initialValues={{ layout: formLayout }}
      style={{ maxWidth: 800, margin: 20 }}
      onFinish={onSubmit}
    >
      <Form.Item
        label="Name:"
        name={"name"}
        rules={[
          {
            required: true,
            message: "Please enter a name",
          },
        ]}
        hasFeedback
      >
        <Input placeholder="Name" />
      </Form.Item>
      <Form.Item
        label="Streams"
        name="stream"
        rules={[
          {
            required: true,
            message: "Please enter a stream",
          },
        ]}
      >
        <Input placeholder="Streams" type="number" />
      </Form.Item>
      <Form.Item
        label="Rate"
        name="rate"
        rules={[
          {
            required: true,
            message: "Please enter a rate",
          },
        ]}
      >
        <Input placeholder="Rate" type="number" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Add
        </Button>
      </Form.Item>
    </Form>
  );
};

export default InputForm;
