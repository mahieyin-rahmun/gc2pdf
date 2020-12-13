import { NextApiResponse } from "next";

export function constructJsonResponse(
  res: NextApiResponse,
  statusCode: number,
  status: "success" | "error",
  body: Record<string, any>,
) {
  return res.status(statusCode).json({
    status,
    body,
  });
}
