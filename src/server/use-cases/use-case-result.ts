export type UseCaseResult<
  TData = null,
  TErrors extends Record<string, string> = Record<string, string>,
> =
  | {
      success: true;
      status: number;
      message: string;
      data: TData;
    }
  | {
      success: false;
      status: number;
      message: string;
      errors?: TErrors;
    };
