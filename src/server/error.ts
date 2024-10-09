export const error = (message: string, status: number) => new Response(message, { status });
export const handleError = (e: any) => {
  if (e instanceof Response) {
    return e;
  }

  console.error(e);
  return error("internal server error.", 500);
};
