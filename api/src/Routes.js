import { Router } from "express";

const routes = Router();

routes.post("/certification", async (req, resp) => {
  const message = {
    user: { id: 1, name: "bruno" },
    course: "Kafka",
    grade: 3,
  };

  await req.producer.send({
    topic: "issue-certificate",
    messages: [
      {
        value: JSON.stringify(message),
      },
    ],
  });
  return resp.json({ ok: true });
});

export default routes;
